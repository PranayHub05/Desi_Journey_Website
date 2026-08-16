/**
 * Converts standard Google Drive sharing links into direct image rendering links
 * compatible with HTML <img> tags.
 * 
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?export=download&id=FILE_ID
 */
export function formatDriveLink(url) {
  if (!url || typeof url !== 'string') return url;
  
  const trimmed = url.trim();
  
  // Matches /file/d/FILE_ID
  const pathRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  // Matches ?id=FILE_ID or &id=FILE_ID
  const queryRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
  
  let match = trimmed.match(pathRegex);
  if (!match) {
    match = trimmed.match(queryRegex);
  }
  
  if (match && match[1]) {
    const fileId = match[1];
    // Uses Google's direct image rendering host
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return trimmed;
}
