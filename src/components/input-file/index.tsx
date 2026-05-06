import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

interface FileInputProps {
  label?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  hint?: string;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileInput({
  label,
  required,
  accept,
  maxSizeMB = 10,
  hint,
  onChange,
  error,
}: FileInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const handleChange = (f: File) => {
    if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Arquivo muito grande. Máximo: ${maxSizeMB} MB`);
      setFile(null);
      onChange(null);
      return;
    }
    setLocalError(null);
    setFile(f);
    onChange(f);
  };

  const clear = () => {
    setFile(null);
    setLocalError(null);
    onChange(null);
    if (ref.current) ref.current.value = "";
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B`
    : b < 1048576 ? `${(b / 1024).toFixed(1)} KB`
    : `${(b / 1048576).toFixed(2)} MB`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium">
          {label}{required && <span className="text-destructive"> *</span>}
        </label>
      )}

      <div className={cn(
        "flex h-9 rounded-md border border-input bg-background text-sm overflow-hidden transition-colors",
        "focus-within:ring-1 focus-within:ring-ring",
        file && "border-green-500",
        displayError && "border-destructive"
      )}>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground bg-muted border-r border-input hover:bg-accent"
        >
          <UploadIcon />
          Escolher arquivo
        </button>

        <span className={cn(
          "flex-1 px-3 flex items-center truncate text-muted-foreground",
          file && "text-foreground"
        )}>
          {file ? `${file.name}  (${formatSize(file.size)})` : "Nenhum arquivo selecionado"}
        </span>

        {file && (
          <button
            type="button"
            onClick={clear}
            className="w-8 flex items-center justify-center border-l border-input text-muted-foreground hover:text-destructive"
          >
            ✕
          </button>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleChange(f); }}
      />

      {displayError
        ? <p className="text-xs text-destructive">{displayError}</p>
        : hint && <p className="text-xs text-muted-foreground font-mono">{hint}</p>
      }
    </div>
  );
}