
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link as LinkIcon, Image as ImageIcon 
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export interface RichTextEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
}

interface RichTextEditorProps {
  initialContent?: string;
  onUpdate?: (content: string) => void;
  className?: string;
  imageUrl?: string | null;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ initialContent = '', onUpdate, className, imageUrl }, ref) => {
    const [content, setContent] = useState(initialContent);

    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 underline',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'mx-auto my-4 max-w-full h-auto rounded-md',
          },
        }),
      ],
      content: initialContent,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setContent(html);
        if (onUpdate) onUpdate(html);
      },
    });

    useEffect(() => {
      if (editor && initialContent) {
        editor.commands.setContent(initialContent);
      }
    }, [initialContent, editor]);

    useImperativeHandle(ref, () => ({
      getContent: () => editor ? editor.getHTML() : content,
      setContent: (newContent: string) => {
        if (editor) {
          editor.commands.setContent(newContent);
        }
        setContent(newContent);
      },
    }));

    const executeCommand = (command: string, value?: string) => {
      if (!editor) return;
      
      switch (command) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'alignLeft':
          editor.chain().focus().setTextAlign('left').run();
          break;
        case 'alignCenter':
          editor.chain().focus().setTextAlign('center').run();
          break;
        case 'alignRight':
          editor.chain().focus().setTextAlign('right').run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'link':
          const url = value || prompt('Enter URL:');
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
          }
          break;
        case 'image':
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
          break;
        default:
          break;
      }
    };

    if (!editor) {
      return null;
    }

    return (
      <div className={cn("border rounded-md", className)}>
        <div className="border-b border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
          <ToggleGroup type="multiple" className="flex flex-wrap gap-1">
            <ToggleGroupItem 
              value="bold" 
              aria-label="텍스트 굵게" 
              onClick={() => executeCommand('bold')}
              data-active={editor.isActive('bold')}
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            >
              <Bold size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="italic" 
              aria-label="텍스트 기울임" 
              onClick={() => executeCommand('italic')}
              data-active={editor.isActive('italic')}
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            >
              <Italic size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="underline" 
              aria-label="텍스트 밑줄" 
              onClick={() => executeCommand('underline')}
              data-active={editor.isActive('underline')}
              className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            >
              <Underline size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          
          <ToggleGroup type="single" className="flex flex-wrap gap-1">
            <ToggleGroupItem 
              value="alignLeft" 
              aria-label="왼쪽 정렬" 
              onClick={() => executeCommand('alignLeft')}
              data-active={editor.isActive({ textAlign: 'left' })}
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
            >
              <AlignLeft size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="alignCenter" 
              aria-label="가운데 정렬" 
              onClick={() => executeCommand('alignCenter')}
              data-active={editor.isActive({ textAlign: 'center' })}
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
            >
              <AlignCenter size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="alignRight" 
              aria-label="오른쪽 정렬" 
              onClick={() => executeCommand('alignRight')}
              data-active={editor.isActive({ textAlign: 'right' })}
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
            >
              <AlignRight size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className={cn("h-8 w-8 p-0", editor.isActive('bulletList') ? 'bg-gray-200' : '')}
            onClick={() => executeCommand('bulletList')}
          >
            <List size={16} />
          </Button>
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className={cn("h-8 w-8 p-0", editor.isActive('orderedList') ? 'bg-gray-200' : '')}
            onClick={() => executeCommand('orderedList')}
          >
            <ListOrdered size={16} />
          </Button>
          
          <span className="w-px h-6 bg-gray-300 mx-1"></span>
          
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className={cn("h-8 w-8 p-0", editor.isActive('link') ? 'bg-gray-200' : '')}
            onClick={() => executeCommand('link')}
          >
            <LinkIcon size={16} />
          </Button>
          
          {imageUrl && (
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => executeCommand('image')}
            >
              <ImageIcon size={16} />
            </Button>
          )}
        </div>
        
        <EditorContent 
          editor={editor} 
          className="min-h-[240px] max-h-[500px] overflow-y-auto p-4 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
