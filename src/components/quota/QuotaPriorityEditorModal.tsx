import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import styles from '@/pages/QuotaPage.module.scss';

interface QuotaPriorityEditorModalProps {
  disabled: boolean;
  error: string;
  fileName: string;
  open: boolean;
  saving: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function QuotaPriorityEditorModal({
  disabled,
  error,
  fileName,
  open,
  saving,
  value,
  onChange,
  onClose,
  onSave
}: QuotaPriorityEditorModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeDisabled={saving}
      width={420}
      title={t('quota_management.edit_priority_title', { name: fileName })}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave} loading={saving} disabled={disabled || saving}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className={styles.priorityEditorBody}>
        <Input
          autoFocus
          label={t('auth_files.priority_label')}
          value={value}
          placeholder={t('auth_files.priority_placeholder')}
          hint={t('auth_files.priority_hint')}
          error={error || undefined}
          disabled={disabled || saving}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            onSave();
          }}
        />
      </div>
    </Modal>
  );
}
