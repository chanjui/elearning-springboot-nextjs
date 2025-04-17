import { Avatar, AvatarFallback, AvatarImage } from "@/components/user/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/vibrant-city-market.png" alt="Avatar" />
          <AvatarFallback>김</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">김민수</p>
          <p className="text-sm text-muted-foreground">kim@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₩120,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/diverse-group-brainstorming.png" alt="Avatar" />
          <AvatarFallback>이</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">이지은</p>
          <p className="text-sm text-muted-foreground">lee@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₩250,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/diverse-group-brainstorming.png" alt="Avatar" />
          <AvatarFallback>박</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">박준호</p>
          <p className="text-sm text-muted-foreground">park@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₩180,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/diverse-group-celebrating.png" alt="Avatar" />
          <AvatarFallback>최</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">최유진</p>
          <p className="text-sm text-muted-foreground">choi@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₩350,000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36&query=user5" alt="Avatar" />
          <AvatarFallback>정</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">정승호</p>
          <p className="text-sm text-muted-foreground">jung@example.com</p>
        </div>
        <div className="ml-auto font-medium">+₩150,000</div>
      </div>
    </div>
  )
}
