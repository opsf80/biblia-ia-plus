import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import VerseSearch from "./VerseSearch";
import { BibleVerse } from "@/services/bible";

interface VerseShareDialogProps {
  onInsertVerse: (text: string) => void;
}

const VerseShareDialog = ({ onInsertVerse }: VerseShareDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleVerseSelect = (verse: BibleVerse, version: string) => {
    const formattedVerse = `> ${verse.content}\n> \n> ${verse.reference} (${version})`;
    onInsertVerse(formattedVerse);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Inserir Versículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Versículo</DialogTitle>
          <DialogDescription>
            Pesquise por palavras-chave ou insira uma referência específica (ex: João 3:16) para compartilhar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <VerseSearch onVerseSelect={handleVerseSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerseShareDialog;
