export interface ConfirmationModalProps {
	text: string;
	title: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}