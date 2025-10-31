/**
 * Downloads a file from a string content.
 * @param content - The string content of the file (plain text, JSON, CSV, Base64, etc.)
 * @param filename - The name of the file to download (including extension, e.g. "data.txt")
 * @param mimeType - (Optional) MIME type of the file, defaults to "text/plain"
 */
export function downloadFileFromString(
    content: string,
    filename: string,
    mimeType: string = 'text/plain'
): void {
    // Create a Blob from the string content
    const blob = new Blob([content], { type: mimeType });

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Append to the DOM (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
