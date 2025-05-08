
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BibleVerse, BIBLE_VERSIONS } from '@/services/bible';

interface BibleContentProps {
  selectedBook: string;
  selectedChapter: number;
  selectedVersion: string;
  verses: BibleVerse[];
  isLoading: boolean;
  isImporting: boolean;
}

const BibleContent: React.FC<BibleContentProps> = ({
  selectedBook,
  selectedChapter,
  selectedVersion,
  verses,
  isLoading,
  isImporting
}) => {
  const getVersionName = () => {
    const version = Object.values(BIBLE_VERSIONS).find(v => v.id === selectedVersion);
    return version?.abbreviation || '';
  };

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-baseline">
          <span className="text-2xl font-bold">{selectedBook}</span>
          <span className="chapter-number ml-2">{selectedChapter}</span>
          <span className="ml-auto text-sm text-muted-foreground">{getVersionName()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || isImporting ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-center">
              <p>Carregando...</p>
            </div>
          </div>
        ) : (
          <div className="bible-text space-y-4">
            {verses.length > 0 ? (
              verses.map((verse) => (
                <p key={verse.id} className="flex">
                  <span className="verse-number mr-2 text-muted-foreground">
                    {verse.reference ? verse.reference.split(':')[1] : verse.number}
                  </span>
                  <span>{verse.content || verse.text}</span>
                </p>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Não foram encontrados versículos para este capítulo.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleContent;
