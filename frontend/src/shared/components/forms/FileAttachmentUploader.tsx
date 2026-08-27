import { useRef, useState } from "react";

import {
    Alert,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PdfPreviewDialog from "../dialogs/PdfPreviewDialog";

import {
    PDFDocument,
    type PDFImage,
    type PDFPage,
} from "pdf-lib";

interface FileAttachmentUploaderProps {
    disabled?: boolean;
    existingFileName?: string | null;
    onCombinedFileChange?: (file: File | null) => void;
}

interface SelectedFile {
    id: string;
    file: File;
}

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

const ACCEPTED_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

function createFileId(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
}

function isAcceptedFile(file: File): boolean {
    return ACCEPTED_MIME_TYPES.has(file.type);
}

function getFileTypeLabel(file: File): string {
    if (file.type === "application/pdf") {
        return "PDF";
    }

    return "Imagen";
}

function formatFileSize(size: number): string {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

async function embedImage(
    pdf: PDFDocument,
    file: File,
): Promise<PDFImage> {
    const bytes = await file.arrayBuffer();

    if (file.type === "image/png") {
        return pdf.embedPng(bytes);
    }

    return pdf.embedJpg(bytes);
}

async function appendPdf(
    targetPdf: PDFDocument,
    file: File,
): Promise<void> {
    const bytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(bytes);

    const pages = await targetPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices(),
    );

    pages.forEach((page) => {
        targetPdf.addPage(page);
    });
}

async function appendImage(
    targetPdf: PDFDocument,
    file: File,
): Promise<void> {
    const image = await embedImage(targetPdf, file);

    const imageWidth = image.width;
    const imageHeight = image.height;

    const maxWidth = 595;
    const maxHeight = 842;

    const scale = Math.min(
        maxWidth / imageWidth,
        maxHeight / imageHeight,
        1,
    );

    const width = imageWidth * scale;
    const height = imageHeight * scale;

    const page: PDFPage = targetPdf.addPage([
        maxWidth,
        maxHeight,
    ]);

    page.drawImage(image, {
        x: (maxWidth - width) / 2,
        y: (maxHeight - height) / 2,
        width,
        height,
    });
}

async function createCombinedPdf(
    files: SelectedFile[],
): Promise<File> {
    const pdf = await PDFDocument.create();

    for (const selectedFile of files) {
        if (selectedFile.file.type === "application/pdf") {
            await appendPdf(pdf, selectedFile.file);
            continue;
        }

        await appendImage(pdf, selectedFile.file);
    }

    const pdfBytes = await pdf.save();

    /*
     * pdf-lib returns Uint8Array<ArrayBufferLike>.
     *
     * Create a concrete ArrayBuffer so that the generated
     * Uint8Array is compatible with the BlobPart type expected
     * by the browser File constructor.
     */
    const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);

    new Uint8Array(pdfBuffer).set(pdfBytes);

    return new File(
        [pdfBuffer],
        "prueba-psicologica.pdf",
        {
            type: "application/pdf",
        },
    );
}

export default function FileAttachmentUploader({
    disabled = false,
    existingFileName,
    onCombinedFileChange,
}: FileAttachmentUploaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [files, setFiles] = useState<SelectedFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [combinedFile, setCombinedFile] = useState<File | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [draggedFileId, setDraggedFileId] = useState<string | null>(
        null,
    );

    const [dragOverFileId, setDragOverFileId] = useState<string | null>(
        null,
    );

    const totalSize = files.reduce(
        (total, selectedFile) =>
            total + selectedFile.file.size,
        0,
    );

    const handleSelectedFiles = () => {
        if (disabled || isGenerating) {
            return;
        }

        inputRef.current?.click();
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFiles = Array.from(
            event.target.files ?? [],
        );

        if (selectedFiles.length === 0) {
            return;
        }

        setError(null);

        const invalidType = selectedFiles.find(
            (file) => !isAcceptedFile(file),
        );

        if (invalidType) {
            setError(
                `"${invalidType.name}" no es un formato válido. Solo se permiten archivos PDF, JPG y PNG.`,
            );

            event.target.value = "";
            return;
        }

        const oversizedFile = selectedFiles.find(
            (file) => file.size > MAX_FILE_SIZE,
        );

        if (oversizedFile) {
            setError(
                `"${oversizedFile.name}" supera el tamaño máximo permitido de 10 MB.`,
            );

            event.target.value = "";
            return;
        }

        const newFiles = selectedFiles.map((file) => ({
            id: createFileId(file),
            file,
        }));

        const resultingFiles = [
            ...files,
            ...newFiles,
        ];

        const resultingTotalSize = resultingFiles.reduce(
            (total, selectedFile) =>
                total + selectedFile.file.size,
            0,
        );

        if (resultingTotalSize > MAX_TOTAL_SIZE) {
            setError(
                "El tamaño total de los archivos no puede superar los 50 MB.",
            );

            event.target.value = "";
            return;
        }

        setFiles(resultingFiles);
        setCombinedFile(null);
        onCombinedFileChange?.(null);

        event.target.value = "";
    };

    const handleRemoveFile = (fileId: string) => {
        if (disabled || isGenerating) {
            return;
        }

        const updatedFiles = files.filter(
            (selectedFile) =>
                selectedFile.id !== fileId,
        );

        setFiles(updatedFiles);
        setCombinedFile(null);
        setError(null);
        onCombinedFileChange?.(null);
    };

    const handleDragStart = (
        event: React.DragEvent<HTMLLIElement>,
        fileId: string,
    ) => {
        if (disabled || isGenerating) {
            event.preventDefault();
            return;
        }

        setDraggedFileId(fileId);

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
            "text/plain",
            fileId,
        );
    };

    const handleDragOver = (
        event: React.DragEvent<HTMLLIElement>,
        fileId: string,
    ) => {
        if (
            disabled ||
            isGenerating ||
            !draggedFileId ||
            draggedFileId === fileId
        ) {
            return;
        }

        event.preventDefault();

        event.dataTransfer.dropEffect = "move";

        setDragOverFileId(fileId);
    };

    const handleDragLeave = (
        event: React.DragEvent<HTMLLIElement>,
        fileId: string,
    ) => {
        /*
         * relatedTarget prevents clearing the highlight when the
         * pointer moves between children of the same list item.
         */
        const relatedTarget = event.relatedTarget as Node | null;

        if (
            relatedTarget &&
            event.currentTarget.contains(relatedTarget)
        ) {
            return;
        }

        if (dragOverFileId === fileId) {
            setDragOverFileId(null);
        }
    };

    const handleDrop = (
        event: React.DragEvent<HTMLLIElement>,
        targetFileId: string,
    ) => {
        event.preventDefault();

        if (
            disabled ||
            isGenerating ||
            !draggedFileId ||
            draggedFileId === targetFileId
        ) {
            setDraggedFileId(null);
            setDragOverFileId(null);
            return;
        }

        setFiles((currentFiles) => {
            const draggedIndex = currentFiles.findIndex(
                (selectedFile) =>
                    selectedFile.id === draggedFileId,
            );

            const targetIndex = currentFiles.findIndex(
                (selectedFile) =>
                    selectedFile.id === targetFileId,
            );

            if (
                draggedIndex === -1 ||
                targetIndex === -1
            ) {
                return currentFiles;
            }

            const reorderedFiles = [...currentFiles];

            const [draggedFile] =
                reorderedFiles.splice(
                    draggedIndex,
                    1,
                );

            reorderedFiles.splice(
                targetIndex,
                0,
                draggedFile,
            );

            return reorderedFiles;
        });

        /*
         * The existing generated PDF no longer represents the
         * current file order, so it must be regenerated.
         */
        setCombinedFile(null);
        onCombinedFileChange?.(null);

        setDraggedFileId(null);
        setDragOverFileId(null);
    };

    const handleDragEnd = () => {
        setDraggedFileId(null);
        setDragOverFileId(null);
    };

    const handleGeneratePdf = async () => {
        if (files.length === 0 || isGenerating) {
            return;
        }

        try {
            setError(null);
            setIsGenerating(true);

            const generatedPdf =
                await createCombinedPdf(files);

            setCombinedFile(generatedPdf);
            onCombinedFileChange?.(generatedPdf);
        } catch {
            setCombinedFile(null);
            onCombinedFileChange?.(null);

            setError(
                "No fue posible generar el PDF combinado. Verifique que los archivos seleccionados sean válidos.",
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Stack spacing={1.5}>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                }}
            >
                <Stack spacing={2}>
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        alignItems={{
                            xs: "stretch",
                            sm: "center",
                        }}
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                Evidencia de la prueba realizada
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Puede seleccionar varios archivos
                                PDF, JPG o PNG. Todos serán
                                unificados en un solo PDF.
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={
                                <AddOutlinedIcon />
                            }
                            onClick={
                                handleSelectedFiles
                            }
                            disabled={
                                disabled ||
                                isGenerating
                            }
                        >
                            Agregar archivos
                        </Button>
                    </Stack>

                    {files.length > 0 && (
                        <>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Arrastre los archivos para
                                establecer el orden de las páginas
                                del PDF final.
                            </Typography>

                            <List
                                disablePadding
                                sx={{
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 1.5,
                                }}
                            >
                                {files.map(
                                    (
                                        selectedFile,
                                        index,
                                    ) => {
                                        const isPdf =
                                            selectedFile
                                                .file
                                                .type ===
                                            "application/pdf";

                                        const isDragging =
                                            draggedFileId ===
                                            selectedFile.id;

                                        const isDragOver =
                                            dragOverFileId ===
                                            selectedFile.id;

                                        return (
                                            <ListItem
                                                key={
                                                    selectedFile.id
                                                }
                                                draggable={
                                                    !disabled &&
                                                    !isGenerating
                                                }
                                                divider={
                                                    index <
                                                    files.length -
                                                        1
                                                }
                                                onDragStart={(
                                                    event,
                                                ) =>
                                                    handleDragStart(
                                                        event,
                                                        selectedFile.id,
                                                    )
                                                }
                                                onDragOver={(
                                                    event,
                                                ) =>
                                                    handleDragOver(
                                                        event,
                                                        selectedFile.id,
                                                    )
                                                }
                                                onDragLeave={(
                                                    event,
                                                ) =>
                                                    handleDragLeave(
                                                        event,
                                                        selectedFile.id,
                                                    )
                                                }
                                                onDrop={(
                                                    event,
                                                ) =>
                                                    handleDrop(
                                                        event,
                                                        selectedFile.id,
                                                    )
                                                }
                                                onDragEnd={
                                                    handleDragEnd
                                                }
                                                sx={{
                                                    cursor:
                                                        disabled ||
                                                        isGenerating
                                                            ? "default"
                                                            : "grab",
                                                    opacity:
                                                        isDragging
                                                            ? 0.45
                                                            : 1,
                                                    bgcolor:
                                                        isDragOver
                                                            ? "action.hover"
                                                            : "transparent",
                                                    transition:
                                                        "background-color 120ms ease, opacity 120ms ease",
                                                    "&:active":
                                                        {
                                                            cursor:
                                                                "grabbing",
                                                        },
                                                }}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        color="error"
                                                        onClick={() =>
                                                            handleRemoveFile(
                                                                selectedFile.id,
                                                            )
                                                        }
                                                        disabled={
                                                            disabled ||
                                                            isGenerating
                                                        }
                                                        aria-label={`Eliminar ${selectedFile.file.name}`}
                                                    >
                                                        <DeleteOutlineOutlinedIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <DragIndicatorOutlinedIcon
                                                    sx={{
                                                        mr: 1,
                                                        color:
                                                            "text.disabled",
                                                    }}
                                                    aria-hidden="true"
                                                />

                                                {isPdf ? (
                                                    <PictureAsPdfOutlinedIcon
                                                        sx={{
                                                            mr: 1.5,
                                                        }}
                                                        color="error"
                                                    />
                                                ) : (
                                                    <ImageOutlinedIcon
                                                        sx={{
                                                            mr: 1.5,
                                                        }}
                                                        color="primary"
                                                    />
                                                )}

                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                pr: 5,
                                                            }}
                                                        >
                                                            {index +
                                                                1}.{" "}
                                                            {
                                                                selectedFile
                                                                    .file
                                                                    .name
                                                            }
                                                        </Typography>
                                                    }
                                                    secondary={`${getFileTypeLabel(
                                                        selectedFile.file,
                                                    )} · ${formatFileSize(
                                                        selectedFile
                                                            .file
                                                            .size,
                                                    )}`}
                                                />
                                            </ListItem>
                                        );
                                    },
                                )}
                            </List>
                        </>
                    )}

                    {files.length > 0 && (
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1.5}
                            alignItems={{
                                xs: "stretch",
                                sm: "center",
                            }}
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {files.length}{" "}
                                {files.length === 1
                                    ? "archivo"
                                    : "archivos"}{" "}
                                ·{" "}
                                {formatFileSize(
                                    totalSize,
                                )}
                            </Typography>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <VisibilityOutlinedIcon />
                                    }
                                    onClick={() => setIsPreviewOpen(true)}
                                    disabled={
                                        disabled ||
                                        isGenerating ||
                                        !combinedFile
                                    }
                                >
                                    Vista previa
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={
                                        <AttachFileOutlinedIcon />
                                    }
                                    onClick={handleGeneratePdf}
                                    disabled={
                                        disabled ||
                                        isGenerating
                                    }
                                >
                                    {isGenerating
                                        ? "Generando PDF..."
                                        : combinedFile
                                        ? "Regenerar PDF"
                                        : "Combinar en un PDF"}
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    {combinedFile && (
                        <Alert severity="success">
                            PDF generado correctamente:{" "}
                            <strong>
                                {combinedFile.name}
                            </strong>{" "}
                            ·{" "}
                            {formatFileSize(
                                combinedFile.size,
                            )}
                        </Alert>
                    )}

                    {existingFileName &&
                        !combinedFile && (
                            <Alert severity="info">
                                Archivo actualmente
                                asociado:{" "}
                                <strong>
                                    {existingFileName}
                                </strong>
                                . Si genera un nuevo
                                PDF, este reemplazará
                                al archivo actual.
                            </Alert>
                        )}
                </Stack>
            </Box>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                Formatos permitidos: PDF, JPG y PNG.
                Máximo 10 MB por archivo y 50 MB en total.
            </Typography>
            <PdfPreviewDialog
                open={isPreviewOpen}
                file={combinedFile}
                onClose={() => setIsPreviewOpen(false)}
            />
        </Stack>
    );
}