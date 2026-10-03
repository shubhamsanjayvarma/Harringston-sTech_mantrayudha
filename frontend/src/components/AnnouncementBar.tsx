import { Leaf } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#ebf5ea] border-b border-[#e2efe1] py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-[13px] font-medium text-gray-800">
        <Leaf className="w-3.5 h-3.5 text-novagreen-700 fill-novagreen-700" />
        <span>Fresh picks. Fast delivery.</span>
      </div>
    </div>
  );
}
