import { formatDeadline } from '@/utils/date';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { RadiatingDot } from '@/components/ui/RadiatingDot';
import { ContentTypeBadge } from '@/components/ui/ContentTypeBadge';
import { Check } from 'lucide-react';
import { useCurrencyPreference } from '@/contexts/CurrencyPreferenceContext';
import { BOUNTY_GRACE_PERIOD_DAYS } from '~/types/bounty';

interface BountyMetadataLineProps {
  amount: number;
  expirationDate?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'EXPIRED' | 'REVIEW_PERIOD';
  expiringSoon: boolean;
  className?: string;
  solutionsCount?: number;
  showDeadline?: boolean;
}

export const BountyMetadataLine = ({
  amount,
  expirationDate,
  status,
  expiringSoon,
  className = '',
  showDeadline = true,
}: BountyMetadataLineProps) => {
  const { showUSD } = useCurrencyPreference();

  const isOpen = status === 'OPEN';

  // Format the deadline text based on status
  const getDeadlineText = () => {
    switch (status) {
      case 'OPEN':
        return expirationDate ? formatDeadline(expirationDate) : 'No deadline';
      case 'REVIEW_PERIOD':
        if (expirationDate) {
          const expirationDateObj = new Date(expirationDate);
          const gracePeriodEnd = new Date(expirationDateObj);
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + BOUNTY_GRACE_PERIOD_DAYS);
          const now = new Date();
          const daysLeft = Math.ceil(
            (gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft <= 0) {
            return 'Review ending soon';
          } else if (daysLeft === 1) {
            return 'Review ends tomorrow';
          } else {
            return `Review ends in ${daysLeft} days`;
          }
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
            variant={status === 'OPEN' || status === 'REVIEW_PERIOD' ? 'badge' : 'disabled'}
            currency={showUSD ? 'USD' : 'RSC'}
          />
        </div>

        {showDeadline && (
          <div className="flex items-center gap-2 text-sm">
            {status === 'OPEN' ? (
              <RadiatingDot size={12} dotSize={6} isRadiating={true} className="flex-shrink-0" />
            ) : status === 'CLOSED' ? (
              <Check size={14} className="text-green-600 flex-shrink-0" />
            ) : status === 'REVIEW_PERIOD' ? (
              <RadiatingDot
                size={12}
                dotSize={6}
                isRadiating={true}
                className="flex-shrink-0 text-amber-500"
              />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
            )}
            <span
              className={`${
                status === 'OPEN'
                  ? expiringSoon
                    ? 'text-orange-600 font-medium'
                    : 'text-gray-700'
                  : status === 'CLOSED'
                    ? 'text-green-700 font-medium'
                    : status === 'REVIEW_PERIOD'
                      ? 'text-amber-600 font-medium'
                      : status === 'EXPIRED'
                        ? 'text-gray-500'
                        : 'text-gray-500'
              }`}
            >
              {deadlineText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
