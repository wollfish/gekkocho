'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/modal';

import { Switch } from '@nextui-org/switch';

import { ApiKeyFormModal } from '@/app/dashboard/settings/api/ApiKeyFormModal';
import { Icons } from '@/components/icons';
import { TableColumnInterface, YukiTable } from '@/components/ui/YukiTable';
import { ApiKeyResponseInterface } from '@/lib/zod';

const columns: TableColumnInterface[] = [
    { key: 'kid', type: 'id', label: 'Key ID' },
    { key: 'algorithm', type: 'text', label: 'Algorithm' },
    { key: 'cta', type: 'cta', label: 'Status' },
    { key: 'created_at', type: 'datetime', label: 'Created At' },
    { key: 'updated_at', type: 'datetime', label: 'Updated At' },
    { key: '', type: 'action', label: 'Actions' },
];

interface OwnProps {
    apiKeys: ApiKeyResponseInterface[];
}

export const ApiList: React.FC<OwnProps> = (props) => {

    const { apiKeys = [] } = props;

    const {
        isOpen: isCreateModalOpen,
        onOpen: onCreateModalOpen,
        onClose: onCreateModalClose,
    } = useDisclosure();

    const [action, setAction] = React.useState<'create' | 'update' | 'delete'>(null);
    const [kid, setKid] = React.useState<string>('');

    const onGenerateKey = useCallback(() => {
        setAction('create');
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onUpdateKey = useCallback((data: ApiKeyResponseInterface) => {
        setAction('update');
        setKid(data.kid);
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onDeleteKey = useCallback((data: ApiKeyResponseInterface) => {
        setAction('delete');
        setKid(data.kid);
        onCreateModalOpen();
    }, [onCreateModalOpen]);

    const onClose = useCallback(() => {
        setAction(null);
        setKid('');
        onCreateModalClose();
    }, [onCreateModalClose]);

    const selectedApiKey = useMemo(() => apiKeys.find((apiKey) => apiKey.kid === kid), [apiKeys, kid]);

    const topContent = React.useMemo(() => {
        return (
            <div className="mb-4 flex items-end justify-between gap-4">
                <div/>
                <div className="flex gap-3">
                    <Button
                        className="bg-foreground text-background"
                        endContent={<Icons.plus/>}
                        size="sm"
                        onClick={onGenerateKey}
                    >
                        Generate New API Key
                    </Button>
                </div>
            </div>
        );
    }, [onGenerateKey]);

    const apiKeysTableData = useMemo(() => {
        return apiKeys.map((apiKey) => ({
            ...apiKey,
            cta: (
                <Switch
                    isSelected={apiKey?.state === 'active'}
                    size="sm"
                    onChange={() => onUpdateKey(apiKey)}
                />
            ),
        }));
    }, [apiKeys, onUpdateKey]);

    return (
        <React.Fragment>
            <YukiTable
                columns={columns}
                mainKey="kid"
                tableData={apiKeysTableData}
                topComponent={topContent}
                onDeleteClick={onDeleteKey}
            />
            <ApiKeyFormModal
                action={action}
                isOpen={isCreateModalOpen}
                selectedApiKey={selectedApiKey}
                onClose={onClose}
            />
        </React.Fragment>
    );
};
