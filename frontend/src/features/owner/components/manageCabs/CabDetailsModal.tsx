import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/Tabs';
import { formatCurrency, formatDate } from '@/shared/utils';
import type { CabDisplay } from '../../hooks/useManageCabs';

interface CabDetailsModalProps {
  cab: CabDisplay | null;
  onClose: () => void;
  getDocumentStatusColor: (status: string) => string;
}

export function CabDetailsModal({
  cab,
  onClose,
  getDocumentStatusColor,
}: CabDetailsModalProps) {
  return (
    <Modal
      open={!!cab}
      onOpenChange={() => onClose()}
      title={cab ? `${cab.make} ${cab.model}` : ''}
      size="lg"
    >
      {cab && (
        <TabsRoot defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registration</p>
                <p className="font-medium">{cab.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{cab.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{cab.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-medium">{cab.fuelType}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Service Schedule
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Last Service</p>
                  <p className="font-medium">{formatDate(cab.lastService)}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-600">Next Service</p>
                  <p className="font-medium text-primary-900">
                    {formatDate(cab.nextService)}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-3">
            {Object.entries(cab.documents).map(([docType, doc]) => (
              <div
                key={docType}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {docType}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires: {formatDate(doc.expiry)}
                  </p>
                </div>
                <Badge
                  variant={
                    getDocumentStatusColor(doc.status) as
                      | 'success'
                      | 'warning'
                      | 'error'
                  }
                >
                  {doc.status}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="earnings" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card padding="md" className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(cab.metrics.totalEarnings)}
                </p>
                <p className="text-sm text-gray-500">Total Earnings</p>
              </Card>
              <Card padding="md" className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {cab.metrics.totalTrips}
                </p>
                <p className="text-sm text-gray-500">Total Trips</p>
              </Card>
            </div>
          </TabsContent>
        </TabsRoot>
      )}
    </Modal>
  );
}
