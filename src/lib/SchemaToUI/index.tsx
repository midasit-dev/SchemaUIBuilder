import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';

export default function SchemaToUI(props: { canvas: Canvas }) {
	const { canvas } = props;

	return (
		<React.Fragment>
			{/* canvases is object */}

			<Panel
				key={'PanelCanvas-' + uuidv4().slice(0, 8)}
				width={canvas.width}
				height={canvas.height}
				border={'1px solid #c1c1c3'}
			>
				{canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})}
			</Panel>
		</React.Fragment>
	);
}
