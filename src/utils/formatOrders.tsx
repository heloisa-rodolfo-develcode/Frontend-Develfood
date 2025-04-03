import { formatTextWithBold } from "./formatText";

export const formatOrderMessage = (text: string) => {
  const orderBlocks = text.split(/\n\s*\n/);
  
  return (
    <div className="space-y-4">
      {orderBlocks.map((block, index) => {
        if (/^\d+\./.test(block.trim())) {
          return (
            <div key={index} className="pl-4 border-l-4 border-white ml-2 py-2 space-y-1 bg-cyan-900/10 rounded-r-lg">
              {block.split('\n').map((line, lineIndex) => (
                <div key={lineIndex}>
                  {formatTextWithBold(line.trim())}
                </div>
              ))}
            </div>
          );
        }
        return (
          <div key={index} className="whitespace-pre-wrap">
            {formatTextWithBold(block.trim())}
          </div>
        );
      })}
    </div>
  );
};