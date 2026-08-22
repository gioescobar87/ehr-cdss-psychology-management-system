import { Box, ButtonBase, Stack, Typography } from "@mui/material";

export interface StageNavigatorItem {
  id: string;
  label: string;
  description?: string;
}

interface StageNavigatorProps {
  title: string;
  items: StageNavigatorItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function StageNavigator({
  title,
  items,
  selectedId,
  onSelect,
}: StageNavigatorProps) {
  return (
    <Box
      component="nav"
      aria-label={`Elementos de ${title}`}
      sx={{
        minWidth: 0,
        borderRight: { xs: 0, md: 1 },
        borderBottom: { xs: 1, md: 0 },
        borderColor: "divider",
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="overline" color="text.secondary" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      <Stack spacing={0.5} sx={{ p: 1.25 }}>
        {items.map((item) => {
          const selected = item.id === selectedId;

          return (
            <ButtonBase
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-current={selected ? "page" : undefined}
              sx={{
                display: "block",
                width: "100%",
                p: 1.25,
                borderRadius: 1.5,
                textAlign: "left",
                color: selected ? "primary.main" : "text.primary",
                bgcolor: selected ? "action.selected" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
                "&:focus-visible": {
                  outline: 2,
                  outlineOffset: 1,
                  outlineColor: "primary.main",
                },
              }}
            >
              <Typography variant="body2" fontWeight={selected ? 700 : 500}>
                {item.label}
              </Typography>
              {item.description && (
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              )}
            </ButtonBase>
          );
        })}
      </Stack>
    </Box>
  );
}
