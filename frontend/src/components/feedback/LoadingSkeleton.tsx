import { Skeleton, Stack } from "@mui/material";

interface LoadingSkeletonProps {
    rows?: number;
}

export default function LoadingSkeleton({
    rows = 4
}: LoadingSkeletonProps) {
    return (
        <Stack spacing={1.5}>
            {Array.from({length: rows}).map(
                (_,index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        height={48}
                    />
                )
            )}
        </Stack>
    )
}