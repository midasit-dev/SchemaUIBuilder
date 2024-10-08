import React from 'react';
import { Position } from '@xyflow/react';
import { isEmpty } from 'lodash';

import SchemaToUI from '../../SchemaToUI';
import './CustomNode.css';
import CustomHandle from '../CustomHandle';

function areEqual(prevProps, nextProps) {
	return (
		prevProps.data.schemainfo.id === nextProps.data.schemainfo.id &&
		prevProps.data.edit === nextProps.data.edit
	);
}

const CustomNode = React.memo((props) => {
	const { id, data } = props;
	const [isShake, setIsShake] = React.useState(false);
	return (
		<>
			{!isEmpty(data.schemainfo) && (
				<div className={isShake ? 'shakeshack' : ''} style={{ paddingBottom: 29 }}>
					<CustomHandle id={'top_' + id} type='target' position={Position.Top} />
					<CustomHandle id={'left_' + id} type='target' position={Position.Left} />
					<div>
						<SchemaToUI
							nodeId={id}
							title={data.title}
							schemaInfo={data.schemainfo}
							setIsShake={setIsShake}
							input={data.input}
						/>
					</div>
					<CustomHandle id={'right_' + id} type='source' position={Position.Right} />
					<CustomHandle id={'bottom_' + id} type='source' position={Position.Bottom} />
				</div>
			)}
		</>
	);
}, areEqual);

export default CustomNode;
