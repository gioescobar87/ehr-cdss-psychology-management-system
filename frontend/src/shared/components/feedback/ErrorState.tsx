import { Alert, Box, Button } from "@mui/material";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
export default function ErrorState({
  message = "Unable to load the requested information.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Box sx={{ py: 3 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Box>
  );
}
