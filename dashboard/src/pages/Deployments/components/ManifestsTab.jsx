import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FolderOpen,
  Loader2,
  AlertCircle,
  ChevronRight,
  FileText,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { getManifestFiles, getManifestContent } from "@/api/deploymentDetails.api";

// ─── Helpers ─────────────────────────────────

const prettyPrintJson = (content) => {
  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
};

const SyntaxHighlight = ({ content }) => {
  if (!content) return null;

  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-4 text-xs leading-relaxed">
      <code className="text-slate-300 font-mono whitespace-pre-wrap">{content}</code>
    </pre>
  );
};

const ManifestsTab = ({ deployment, onError }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  // Track the manifest metadata from the API
  const [manifestMeta, setManifestMeta] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [copied, setCopied] = useState(false);
  // Cache fetched manifest content so re-selecting a file doesn't re-fetch
  const [manifestCache, setManifestCache] = useState({});
  const mountedRef = useRef(true);

  const projectName = deployment?.projectName || deployment?.name;

  // Reset cache when project changes
  useEffect(() => {
    setManifestCache({});
  }, [projectName]);

  // ── Derive display content ──
  // For JSON manifests, pretty-print the content for display
  const displayContent = useMemo(() => {
    if (!fileContent) return null;
    if (manifestMeta?.language === "json") {
      return prettyPrintJson(fileContent);
    }
    return fileContent;
  }, [fileContent, manifestMeta]);

  // ── Fetch file list ──
  useEffect(() => {
    mountedRef.current = true;

    const fetchFiles = async () => {
      if (!projectName) {
        setLoading(false);
        setError("No project name available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getManifestFiles(projectName);
        if (mountedRef.current) {
          const filesList = result.files || result.manifests || result.data || [];
          setFiles(Array.isArray(filesList) ? filesList : []);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err.message || "Failed to load manifests";
          setError(msg);
          onError?.(msg);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchFiles();

    return () => {
      mountedRef.current = false;
    };
  }, [projectName, onError]);

  // ── Fetch file content (with caching) ──
  // Expected API response:
  // { success: true, manifest: { name, language, content } }
  const handleSelectFile = useCallback(async (file) => {
    setSelectedFile(file);
    setCopied(false);

    // Return cached content immediately if available
    const cached = manifestCache[file];
    if (cached) {
      setManifestMeta({ name: cached.name, language: cached.language });
      setFileContent(cached.content);
      setContentError(null);
      return;
    }

    setContentLoading(true);
    setContentError(null);
    setFileContent(null);
    setManifestMeta(null);

    try {
      const result = await getManifestContent(projectName, file);
      if (mountedRef.current) {
        // Extract manifest from response: { success, manifest: { name, language, content } }
        const manifest = result.manifest || result;
        const meta = {
          name: manifest.name || file,
          language: manifest.language || "plaintext",
        };
        const content = manifest.content || "";
        // Cache for future selections
        setManifestCache((prev) => ({ ...prev, [file]: { ...meta, content } }));
        setManifestMeta(meta);
        // Use manifest.content — NOT the full API response
        setFileContent(content);
      }
    } catch (err) {
      if (mountedRef.current) {
        setContentError(err.message || "Failed to load file content");
      }
    } finally {
      if (mountedRef.current) setContentLoading(false);
    }
  }, [projectName, manifestCache]);

  // ── Copy displayed content ──
  const handleCopy = useCallback(() => {
    const text = displayContent || fileContent;
    if (text) {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [displayContent, fileContent]);

  // ── Download displayed content ──
  const handleDownload = useCallback(() => {
    const text = displayContent || fileContent;
    const fileName = manifestMeta?.name || selectedFile || "manifest";
    if (!text) return;

    // Pick MIME type based on language
    const mimeMap = {
      yaml: "application/yaml",
      json: "application/json",
      dockerfile: "text/plain",
    };
    const mime = mimeMap[manifestMeta?.language] || "text/plain;charset=utf-8";

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [displayContent, fileContent, manifestMeta, selectedFile]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-slate-400" />
        <span className="ml-2.5 text-sm text-slate-500">Loading manifests...</span>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-8">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  // ── Empty state ──
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
        <FolderOpen size={24} className="text-slate-600" />
        <p className="text-sm text-slate-500">No manifest files found</p>
        <p className="text-xs text-slate-600">Manifests are generated during deployment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* File list */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Files ({files.length})
        </h4>
        {files.map((file) => {
          const fileName = typeof file === "string" ? file : file.name || file.path || file;
          return (
            <button
              key={fileName}
              onClick={() => handleSelectFile(fileName)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedFile === fileName
                  ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border border-[var(--accent-border)]"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-300 border border-transparent"
              }`}
            >
              <FileText size={14} className="shrink-0" />
              <span className="truncate font-mono text-xs">{fileName}</span>
              <ChevronRight
                size={12}
                className={`ml-auto shrink-0 transition-transform ${
                  selectedFile === fileName ? "rotate-90" : ""
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* File content */}
      {selectedFile && (
        <div>
          {/* Header with filename + actions */}
          <div className="flex items-start justify-between mb-2 gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate min-w-0">
              {manifestMeta?.name || selectedFile}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
              {/* Copy button - only when content is available */}
              {fileContent && (
                <button
                  onClick={handleCopy}
                  disabled={contentLoading}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
                  title="Copy file"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              )}
              {/* Download button - only when content is available */}
              {fileContent && (
                <button
                  onClick={handleDownload}
                  disabled={contentLoading}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
                  title="Download file"
                >
                  <Download size={12} />
                  Download
                </button>
              )}
            </div>
          </div>

          {contentLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={16} className="animate-spin text-slate-400" />
              <span className="ml-2 text-xs text-slate-500">Loading file...</span>
            </div>
          ) : contentError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-xs text-red-400">{contentError}</p>
            </div>
          ) : displayContent ? (
            <SyntaxHighlight content={displayContent} />
          ) : fileContent ? (
            <SyntaxHighlight content={fileContent} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ManifestsTab;
