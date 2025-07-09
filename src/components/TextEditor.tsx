
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CloudinaryUploadResponse } from '@/types/cloudinary';

declare global {
  interface Window {
    html2pdf: {
      (element: HTMLElement, options?: Record<string, unknown>): Promise<void>;
    };
  }
}

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    list: false
  });
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');
  const [imageUrl, setImageUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0'
  ];

  const bgColors = [
    'transparent', '#ffcccc', '#ccffcc', '#ccccff', 
    '#ffffcc', '#ffccff', '#ccffff', '#e6e6e6'
  ];

  useEffect(() => {
    // Initialize editor with default content if empty
    if (editorRef.current && !editorRef.current.innerHTML && !value) {
      editorRef.current.innerHTML = '<p><br></p>';
    } else if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }

    // Load html2pdf.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.integrity = 'sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [value]);

  const toggleFormat = (format: string, value?: string) => {
    // Save the current selection
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    // Restore focus to the editor before applying formatting
    editorRef.current.focus();

    // Add a small delay to ensure focus is restored before applying the command
    setTimeout(() => {
      if (format === 'insertUnorderedList') {
        if (selection.toString().length === 0) {
          const bulletPoint = document.createElement('li');
          bulletPoint.textContent = '• ';

          const list = document.createElement('ul');
          list.appendChild(bulletPoint);

          document.execCommand('insertHTML', false, list.outerHTML);
        } else {
          document.execCommand(format, false, value);
        }
      } else {
        document.execCommand(format, false, value);
      }

      updateActiveFormats();
      // Notify parent of change
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  const changeTextColor = (color: string) => {
    editorRef.current?.focus();
    setTimeout(() => {
      document.execCommand('foreColor', false, color);
      setTextColor(color);
      setShowColorPicker(false);
      // Notify parent of change
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  const changeBgColor = (color: string) => {
    editorRef.current?.focus();
    setTimeout(() => {
      document.execCommand('hiliteColor', false, color);
      setBgColor(color);
      setShowBgColorPicker(false);
      // Notify parent of change
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  const insertImage = () => {
    editorRef.current?.focus();
    setTimeout(() => {
      if (imageUrl.trim()) {
        document.execCommand('insertHTML', false, 
          `<img src="${imageUrl}" alt="Uploaded image" style="max-width:100%; height:auto;"/>`);
        setImageUrl('');
      }
    }, 10);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary through your API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data: CloudinaryUploadResponse = await response.json();

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Insert the Cloudinary URL into the editor
      editorRef.current?.focus();
      setTimeout(() => {
        document.execCommand('insertHTML', false, 
          `<img src="${data.imageUrl}" 
            alt="Uploaded image" 
            style="max-width:100%; height:auto;"
            data-public-id="${data.publicId}"/>`);
      }, 10);

    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show an error message to the user
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission/closing
    fileInputRef.current?.click();
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();

    try {
      // Handle text content
      const text = e.clipboardData.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
        return;
      }

      // Handle image content
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find(item => item.type.startsWith('image'));

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;

        setIsUploading(true); // Show upload indicator

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data: CloudinaryUploadResponse = await response.json();

        if (!data.success || !data.imageUrl) {
          throw new Error(data.error || 'Failed to upload image');
        }

        // Insert image with loading animation
        document.execCommand('insertHTML', false, 
          `<img src="${data.imageUrl}" 
            alt="Pasted image" 
            style="max-width:100%; height:auto; animation: fadeIn 0.3s;"
            data-public-id="${data.publicId}"/>`);

        // Notify parent of change
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    } catch (error) {
      console.error('Paste upload error:', error);
      // Show error to user
      alert('Failed to paste image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const handleEditorClick = () => {
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection) return;

    // Check if there's text selected or if the cursor is in formatted text
    let parentElement = selection.anchorNode?.parentElement;

    // Initialize format states
    const formats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      alignment: 'left',
      list: false
    };

    // Check alignment
    if (parentElement) {
      if (document.queryCommandState('justifyCenter')) {
        formats.alignment = 'center';
      } else if (document.queryCommandState('justifyRight')) {
        formats.alignment = 'right';
      }

      // Check if inside a list
      while (parentElement) {
        if (parentElement.tagName === 'UL' || parentElement.tagName === 'OL') {
          formats.list = true;
          break;
        }
        parentElement = parentElement.parentElement;
      }
    }

    // Update state
    setActiveFormats(formats);

    // Update colors
    const foreColor = document.queryCommandValue('foreColor');
    const bgColor = document.queryCommandValue('hiliteColor');

    if (foreColor) setTextColor(rgbToHex(foreColor));
    if (bgColor) setBgColor(bgColor === 'transparent' ? 'transparent' : rgbToHex(bgColor));
  };

  // Helper function to convert RGB to Hex
  const rgbToHex = (rgb: string) => {
    // Handle rgba strings
    if (rgb.startsWith('rgba')) return '#000000';

    // Extract rgb values
    const rgbValues = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgbValues) return '#000000';

    const r = parseInt(rgbValues[1]);
    const g = parseInt(rgbValues[2]);
    const b = parseInt(rgbValues[3]);

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-50 rounded-t-lg border">
        {/* Text Formatting */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFormat('bold');
          }}
          className={`p-2 rounded ${activeFormats.bold ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFormat('italic');
          }}
          className={`p-2 rounded ${activeFormats.italic ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>

        {/* Headings Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowHeadingMenu(!showHeadingMenu);
            }}
            className="p-2 rounded bg-white hover:bg-gray-200"
            title="Headings"
          >
            <span className="text-xs font-bold">H</span>
          </button>
          {showHeadingMenu && (
            <div className="absolute z-10 bg-white shadow-lg rounded-md py-1 w-32">
              {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((heading) => (
                <button
                  key={heading}
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('formatBlock', false, heading.toLowerCase());
                    setShowHeadingMenu(false);
                    if (editorRef.current) {
                      onChange(editorRef.current.innerHTML);
                    }
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  {heading}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowColorPicker(!showColorPicker);
            }}
            className="p-2 rounded bg-white hover:bg-gray-200"
            title="Text Color"
            style={{ color: textColor }}
          >
            <span className="text-xs">A</span>
          </button>
          {showColorPicker && (
            <div className="absolute z-10 bg-white shadow-lg rounded-md p-2 w-48">
              <div className="grid grid-cols-5 gap-2 mb-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.preventDefault();
                      changeTextColor(color);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:border-blue-500"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  e.preventDefault();
                  const color = e.target.value;
                  document.execCommand('foreColor', false, color);
                  setTextColor(color);
                  if (editorRef.current) {
                    onChange(editorRef.current.innerHTML);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Background Color */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowBgColorPicker(!showBgColorPicker);
            }}
            className="p-2 rounded bg-white hover:bg-gray-200"
            title="Background Color"
            style={{ backgroundColor: bgColor === 'transparent' ? 'white' : bgColor }}
          >
            <span className="text-xs">BG</span>
          </button>
          {showBgColorPicker && (
            <div className="absolute z-10 bg-white shadow-lg rounded-md p-2 w-48">
              <div className="grid grid-cols-5 gap-2 mb-2">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.preventDefault();
                      changeBgColor(color);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:border-blue-500"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                onChange={(e) => {
                  e.preventDefault();
                  const color = e.target.value;
                  document.execCommand('hiliteColor', false, color);
                  setBgColor(color);
                  if (editorRef.current) {
                    onChange(editorRef.current.innerHTML);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Bullet List */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFormat('insertUnorderedList');
          }}
          className={`p-2 rounded ${activeFormats.list ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path 
              d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Alignment */}
        <button
          onClick={() => toggleFormat('justifyLeft')}
          className={`p-2 rounded ${activeFormats.alignment === 'left' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Align Left"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => toggleFormat('justifyCenter')}
          className={`p-2 rounded ${activeFormats.alignment === 'center' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Align Center"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M7 12H17M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => toggleFormat('justifyRight')}
          className={`p-2 rounded ${activeFormats.alignment === 'right' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
          title="Align Right"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M7 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image Upload */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => triggerFileInput(e)}
            className={`p-2 rounded ${
              isUploading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-200'
            }`}
            title="Upload Image"
            disabled={isUploading}
          >
            {isUploading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          updateActiveFormats();
          // Pass the HTML content back to parent component
          onChange((e.currentTarget as HTMLDivElement).innerHTML);
        }}
        onClick={handleEditorClick}
        onBlur={updateActiveFormats}
        onPaste={handlePaste}
        className="min-h-[300px] border border-gray-300 rounded-b-lg p-4 focus:outline-none focus:ring-1 focus:ring-blue-500 prose max-w-none [&>h1]:text-4xl [&>h2]:text-3xl [&>h3]:text-2xl [&>h4]:text-xl [&>h5]:text-lg [&>h6]:text-base"
        style={{ backgroundColor: 'white' }}
      ></div>
    </div>
  );
}
