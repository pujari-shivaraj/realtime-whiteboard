"use client"
import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Actions } from "@/components/action";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMutation } from "convex/react";

interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createdAt: number;
    imageUrl: string;
    orgId: string;
    isFavorite: boolean;
  };


export const BoardCard = ({
  id,
  title,
  authorName,
  authorId,
  createdAt,
  imageUrl,
  orgId,
  isFavorite
}:BoardCardProps) =>{
 
  const { userId } = useAuth();
 
  const authorLabel = userId === authorId ? "You" : authorName;
  

  const {
    
    mutate: onFavorite,
    pending: pendingFavorite,

  } = useApiMutation(api.board.favorite);

  const {

    mutate: onUnfavorite,
    pending: pendingUnfavorite,

  } = useApiMutation(api.board.unfavorite);

  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const toggleFavorite = () => {
    if (isFavorite) {
      onUnfavorite({ id })
        .catch(() => toast.error("Failed to unfavorite"))
    } else {
      onFavorite({ id, orgId })
        .catch(() => toast.error("Failed to favorite"))
    }
  };

  return(

    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-fit"
        /> 

        <Overlay/>
        <Actions 
        id={id} 
        title={title}
        side="right"
        >

          <Button
           className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-transparent transition-opacity px-3 py-2 outline-none"
           style={{ backgroundColor: "transparent" }}
          >
           <MoreHorizontal
            className="text-white opacity-75 hover:opacity-100 transition-opacity"
           />
          </Button>

        </Actions>
        
        </div>
        <Footer
         isFavorite={isFavorite}
         title={title}
         authorLabel={authorLabel}
         createdAtLabel={createdAtLabel}
         onClick={toggleFavorite}
         disabled={pendingFavorite || pendingUnfavorite}
        />    
      </div>
    </Link>
      
  );
}


BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rou nded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};


 