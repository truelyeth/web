import { formatDeadline } from '@/utils/date';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { RadiatingDot } from '@/components/ui/RadiatingDot';
import { ContentTypeBadge } from '@/components/ui/ContentTypeBadge';
import { Check } from 'lucide-react';
import { useCurrencyPreference } from '@/contexts/CurrencyPreferenceContext';
interface BountyMetadataLineProps {
  amount: number;
  expirationDate?: string;
  reviewPeriodEndDate?: string;
  status: 'OPEN' | 'CLOSED' | 'REVIEW_PERIOD' | 'EXPIRED' | 'CANCELLED';
  expiringSoon: boolean;
  className?: string;
  solutionsCount?: number;
  showDeadline?: boolean;
}

export const BountyMetadataLine = ({
  amount,
  expirationDate,
  reviewPeriodEndDate,
  status,
  expiringSoon,
  className = '',
  showDeadline = true,
}: BountyMetadataLineProps) => {
  const { showUSD } = useCurrencyPreference();

  const isOpen = status === 'OPEN';
  const isActive = status === 'OPEN' || status === 'REVIEW_PERIOD';

  const getDeadlineText = () => {
    switch (status) {
      case 'OPEN':
        return expirationDate ? formatDeadline(expirationDate) : 'No deadline';
      case 'REVIEW_PERIOD':
        if (reviewPeriodEndDate) {
          return formatDeadline(reviewPeriodEndDate);
        }
        return 'Under Review';
      case 'CLOSED':
        return 'Completed';
      case 'EXPIRED':
        return 'Expired';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Completed';
    }
  };

  const deadlineText = getDeadlineText();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Badges and date in one row */}
      <div className="flex justify-between items-center w-full">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <ContentTypeBadge type="bounty" />
          <CurrencyBadge
            amount={amount}
            size="sm"
            variant={isOpen ? 'badge' : 'disabled'}
            currency={showUSD ? 'USD' : 'RSC'}
          />
        </div>

        {showDeadline && (
          <div className="flex items-center gap-2 text-sm">
            {isActive ? (
              <RadiatingDot
                size={12}
                dotSize={6}
                isRadiating={isActive}
                className="flex-shrink-0"
              />
            ) : (
              <Check size={14} className="text-green-600 flex-shrink-0" />
            )}
            <span
              className={`${isActive ? (expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-700') : 'text-green-700 font-medium'}`}
            >
              {deadlineText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
