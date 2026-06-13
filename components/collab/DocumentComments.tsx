'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, ThumbsUp } from 'lucide-react';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: number;
  lineNumber: number;
  resolved: boolean;
  replies: Comment[];
  reactions: Map<string, number>; // emoji -> count
}

interface DocumentCommentsProps {
  documentId: string;
  userId: string;
  comments: Comment[];
  onAddComment: (lineNumber: number, content: string) => void;
  onReplyComment: (commentId: string, content: string) => void;
  onResolveComment: (commentId: string) => void;
}

export function DocumentComments({
  documentId,
  userId,
  comments,
  onAddComment,
  onReplyComment,
  onResolveComment,
}: DocumentCommentsProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (lineNumber: number) => {
    if (!newComment.trim()) return;

    onAddComment(lineNumber, newComment);
    setNewComment('');
    setSelectedLine(null);
  };

  const handleReply = (commentId: string) => {
    if (!newComment.trim()) return;

    onReplyComment(commentId, newComment);
    setNewComment('');
    setReplyingTo(null);
  };

  const lineComments = comments.filter((c) => c.lineNumber === selectedLine);

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Comments
          </h3>
          {comments.length > 0 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
              {comments.length}
            </span>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No comments yet</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Select text to comment
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              userId={userId}
              onReply={() => setReplyingTo(comment.id)}
              onResolve={() => onResolveComment(comment.id)}
              isReplying={replyingTo === comment.id}
              onSubmitReply={(content) => handleReply(comment.id)}
            />
          ))
        )}
      </div>

      {/* New Comment Input */}
      {selectedLine !== null && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Line {selectedLine}
          </div>

          <div className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.currentTarget.value)}
              placeholder="Add a comment..."
              className="w-full p-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleAddComment(selectedLine)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Comment
              </button>

              <button
                onClick={() => {
                  setSelectedLine(null);
                  setNewComment('');
                }}
                className="px-3 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Comment Thread Component
 */
interface CommentThreadProps {
  comment: Comment;
  userId: string;
  onReply: () => void;
  onResolve: () => void;
  isReplying: boolean;
  onSubmitReply: (content: string) => void;
}

function CommentThread({
  comment,
  userId,
  onReply,
  onResolve,
  isReplying,
  onSubmitReply,
}: CommentThreadProps) {
  const [replyText, setReplyText] = useState('');

  return (
    <div
      className={`p-3 rounded-lg border ${
        comment.resolved
          ? 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700 opacity-60'
          : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={comment.avatar}
            alt={comment.userName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.userName}
          </span>
        </div>

        {comment.resolved && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Resolved
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>

      {/* Timestamp & Line */}
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        {new Date(comment.timestamp).toLocaleString()} · Line {comment.lineNumber}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={onReply}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Reply
        </button>

        {!comment.resolved && comment.userId === userId && (
          <button
            onClick={onResolve}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            Resolve
          </button>
        )}

        <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          {comment.reactions.get('👍') || 0}
        </button>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3 pl-3 border-l-2 border-gray-300 dark:border-gray-600 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={reply.avatar}
                  alt={reply.userName}
                  className="w-5 h-5 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {reply.userName}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {isReplying && (
        <div className="mt-3 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.currentTarget.value)}
            placeholder="Write a reply..."
            className="w-full p-2 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                onSubmitReply(replyText);
                setReplyText('');
              }}
              className="px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              Reply
            </button>

            <button
              onClick={() => setReplyText('')}
              className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}