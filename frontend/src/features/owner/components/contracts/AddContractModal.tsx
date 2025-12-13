import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CreateContractDto } from '@/services/owner.service';

interface AddContractModalProps {
    open: boolean;
    contract: CreateContractDto;
    isCreating: boolean;
    createError: string | null;
    onOpenChange: (open: boolean) => void;
    onFieldChange: <K extends keyof CreateContractDto>(field: K, value: CreateContractDto[K]) => void;
    onSubmit: () => void;
}

export function AddContractModal({
    open,
    contract,
    isCreating,
    createError,
    onOpenChange,
    onFieldChange,
    onSubmit,
}: AddContractModalProps) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Create New Contract"
            size="lg"
        >
            <div className="space-y-4">
                {createError && (
                    <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
                        {createError}
                    </div>
                )}

                <Select
                    label="Contract Type *"
                    options={[
                        { value: 'driver', label: 'Driver Agreement' },
                        { value: 'platform', label: 'Platform Partnership' },
                        { value: 'insurance', label: 'Insurance Policy' },
                    ]}
                    value={contract.type}
                    onValueChange={(value) => onFieldChange('type', value as 'driver' | 'platform' | 'insurance')}
                />

                <Input
                    label="Contract Title *"
                    placeholder="e.g., Driver Employment Agreement"
                    value={contract.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                />

                <Input
                    label="Party Name *"
                    placeholder="e.g., John Doe"
                    value={contract.partyName}
                    onChange={(e) => onFieldChange('partyName', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date *"
                        type="date"
                        value={contract.startDate}
                        onChange={(e) => onFieldChange('startDate', e.target.value)}
                    />
                    <Input
                        label="End Date *"
                        type="date"
                        value={contract.endDate}
                        onChange={(e) => onFieldChange('endDate', e.target.value)}
                    />
                </div>

                {contract.type === 'driver' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Commission Rate (%)"
                            type="number"
                            placeholder="15"
                            value={contract.commission?.toString() || ''}
                            onChange={(e) => onFieldChange('commission', parseInt(e.target.value) || 0)}
                        />
                        <Input
                            label="Monthly Target (₹)"
                            type="number"
                            placeholder="50000"
                            value={contract.monthlyTarget?.toString() || ''}
                            onChange={(e) => onFieldChange('monthlyTarget', parseInt(e.target.value) || 0)}
                        />
                    </div>
                )}

                {contract.type === 'insurance' && (
                    <Input
                        label="Premium Amount (₹)"
                        type="number"
                        placeholder="25000"
                        value={contract.premium?.toString() || ''}
                        onChange={(e) => onFieldChange('premium', parseInt(e.target.value) || 0)}
                    />
                )}

                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => onOpenChange(false)}
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        onClick={onSubmit}
                        loading={isCreating}
                        disabled={isCreating}
                    >
                        Create Contract
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
