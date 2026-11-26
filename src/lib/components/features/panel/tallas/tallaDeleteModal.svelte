<script lang="ts">
	import { ModalConfirm } from '#lib/components/ui/index.ts';
	import { ErrorCode } from '#lib/interfaces/index.ts';
	import type { Talla } from '#lib/interfaces/index.ts';
	import { errorService, tallaService } from '#lib/services/index.ts';
	import { alert } from '#lib/utils/index.ts';

	interface Props {
		/** Tamaño (talla en la API) a eliminar; null = modal cerrado */
		talla: Talla | null;
		onClose: () => void;
		onDeleted: (talla: Talla) => void;
	}

	let { talla, onClose, onDeleted }: Props = $props();

	let isLoading = $state(false);

	function handleCancel() {
		// No cerrar a mitad de la petición para no perder la respuesta
		if (isLoading) return;
		onClose();
	}

	async function handleConfirm() {
		if (!talla || isLoading) return;
		const target = talla;

		isLoading = true;
		let deleted = false;
		try {
			await tallaService.remove(target.id);
			alert('success', `Tamaño «${target.etiqueta}» eliminado correctamente.`);
			onDeleted(target);
			deleted = true;
		} catch (error) {
			// 409: el tamaño está asignado a SKUs activos
			alert(
				'error',
				errorService.getMessage(error, {
					[ErrorCode.CONFLICT]: 'No se puede eliminar un tamaño asignado a SKUs activos.'
				}),
				{ duration: 4000 }
			);
		} finally {
			isLoading = false;
		}

		if (deleted) onClose();
	}
</script>

<ModalConfirm
	isOpen={!!talla}
	message={talla
		? `¿Seguro que querés eliminar el tamaño «${talla.etiqueta}»? Dejará de aparecer en el listado. Solo se puede eliminar si no está asignado a SKUs activos.`
		: ''}
	loading={isLoading}
	onConfirm={handleConfirm}
	onCancel={handleCancel}
/>
