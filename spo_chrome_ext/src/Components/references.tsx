import React from 'react';
export interface ReferenceProps {
  url: string;
  faviconUrl: string;
  siteName: string;
  index: number;
}

interface ReferencesListProps {
  references: ReferenceProps[];
}

const ReferencesList: React.FC<ReferencesListProps> = ({ references }) => {
  return (
    <div className="space-y-2">
      {references.map(({ url, faviconUrl, siteName, index }) => (
        <div key={index}>
          <a
            href={url}
            className="block group cursor-pointer"
            target="_blank"
            rel="noopener"
          >
            <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
              <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                  {index}
                </div>
              </div>
              <div className="pl-xs -mt-one">
                <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                  <div className="relative">
                    <div className="rounded-full overflow-hidden">
                      <img
                        className="block w-[16px] h-[16px]"
                        src={faviconUrl}
                        alt={`${siteName} favicon`}
                        width="16"
                        height="16"
                      />
                    </div>
                  </div>
                  <div className="duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
                    {siteName}
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ReferencesList;
