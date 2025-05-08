
import React from 'react';
import BibleControls from './reader/BibleControls';
import BibleContent from './reader/BibleContent';
import { useBibleData } from './reader/useBibleData';

const BibleReader = () => {
  const {
    books,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    selectedVersion,
    setSelectedVersion,
    verses,
    maxChapters,
    isLoading,
    isImporting
  } = useBibleData();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <BibleControls
        books={books}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        maxChapters={maxChapters}
        isLoading={isLoading}
        isImporting={isImporting}
      />
      
      <BibleContent
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        selectedVersion={selectedVersion}
        verses={verses}
        isLoading={isLoading}
        isImporting={isImporting}
      />
    </div>
  );
};

export default BibleReader;
