import { User, FileText, Car, Eye, Download } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { Contract } from '@/services/owner.service';

interface ContractDetailsModalProps {
  contract: Contract | null;
  isProcessing: boolean;
  onClose: () => void;
  onRenew: (id: string) => void;
  onTerminate: (id: string) => void;
}

export function ContractDetailsModal({
  contract,
  isProcessing,
  onClose,
  onRenew,
  onTerminate,
}: ContractDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="error">Expired</Badge>;
      case 'pending':
        return <Badge variant="primary">Pending</Badge>;
      default:
        return null;
    }
  };

  const getContractIcon = (type: string) => {
    switch (type) {
      case 'driver':
        return <User className="w-8 h-8 text-primary-600" />;
      case 'platform':
        return <FileText className="w-8 h-8 text-accent-600" />;
      default:
        return <Car className="w-8 h-8 text-success-600" />;
    }
  };

  const getIconBgClass = (type: string) => {
    switch (type) {
      case 'driver':
        return 'bg-primary-100';
      case 'platform':
        return 'bg-accent-100';
      default:
        return 'bg-success-100';
    }
  };

  return (
    <Modal
      open={!!contract}
      onOpenChange={() => onClose()}
      title="Contract Details"
      size="lg"
    >
      {contract && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-lg flex items-center justify-center ${getIconBgClass(contract.type)}`}
            >
              {getContractIcon(contract.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {contract.title}
                </h3>
                {getStatusBadge(contract.status)}
              </div>
              <p className="text-gray-500">{contract.partyName}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(contract.startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(contract.endDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Assigned</p>
              <p className="font-medium text-gray-900">
                {contract.vehicleAssigned}
              </p>
            </div>
            {contract.commission && (
              <div>
                <p className="text-sm text-gray-500">Commission Rate</p>
                <p className="font-medium text-gray-900">
                  {contract.commission}%
                </p>
              </div>
            )}
            {(contract.monthlyTarget ?? 0) > 0 && (
              <div>
                <p className="text-sm text-gray-500">Monthly Target</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(contract.monthlyTarget ?? 0)}
                </p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Attached Documents
            </h4>
            <div className="space-y-2">
              {contract.documents.map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{doc}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" fullWidth disabled={isProcessing}>
              Edit Contract
            </Button>
            {contract.status === 'expiring' && (
              <Button
                fullWidth
                onClick={() => onRenew(contract.id)}
                disabled={isProcessing}
                loading={isProcessing}
              >
                Renew Contract
              </Button>
            )}
            {contract.status === 'active' && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => onTerminate(contract.id)}
                disabled={isProcessing}
                loading={isProcessing}
              >
                Terminate Contract
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
