import { IconCloud } from "@tabler/icons-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyOutline() {
  return (
    <Empty className="border border-dashed rounded-xl bg-muted/30 p-6 sm:p-10">
      <EmptyHeader className="text-center space-y-3">
        <EmptyMedia
          variant="icon"
          className="mx-auto w-12 h-12 sm:w-14 sm:h-14"
        >
          <IconCloud className="w-full h-full text-muted-foreground" />
        </EmptyMedia>

        <EmptyTitle className="text-lg sm:text-xl">
          Hozircha ma’lumot yo‘q
        </EmptyTitle>

        <EmptyDescription className="text-sm sm:text-base max-w-md mx-auto">
          Bu sahifa bosh sahifa hisoblanadi. Ma’lumotlar qo‘shilgach, ular shu
          yerda ko‘rinadi.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent />
    </Empty>
  );
}
