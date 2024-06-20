import React from 'react';
import { Panel } from '@midasit-dev/moaui';
import { v4 as uuidv4 } from 'uuid';
import ToComponent from './ToComponent';
import { Canvas, Canvases, Layer } from '../Common/types';
import { SvgClose } from '../SVGComps/index';
import RJSFComp from './rjsf';

import { useSnackbar } from 'notistack';

const maxWidth = 620;
const maxHeight = 620;

export default function SchemaToUI(props: {
	nodeId: string;
	schemaInfo: any;
	onRemove: (nodeId: string, functionId: string) => void;
}) {
	const { nodeId, schemaInfo, onRemove } = props;
	const [bgColor, setBgColor] = React.useState('transparent');
	const [canvas, setCanvas] = React.useState<Canvas>({
		width: 300,
		height: 300,
		layers: [],
	});
	
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // const action = (key) => (
  //   <Button sx={{m:0, p:0}} onClick={() => closeSnackbar(key)}>
  //     <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M0.759766 0.76001L9.24505 9.24529" stroke="#D5D9DE" strokeLinecap="round"/>
  //       <path d="M9.24512 0.76001L0.759836 9.24529" stroke="#D5D9DE" strokeLinecap="round"/>
  //     </svg>
  //   </Button>
  // );

	// function showSuccessSnackbar(msg){
  //   enqueueSnackbar(msg, {
  //     variant: "customSuccess",
  //     anchorOrigin: {
  //       vertical: 'bottom',
  //       horizontal: 'center',
  //     },
  //     action,
  //     marginBottom: "2.5rem",
  //   });
  // }

	// function showErrorSnackbar(msg){
  //   enqueueSnackbar(msg, {
  //     variant: "customError",
  //     anchorOrigin: {
  //       vertical: 'bottom',
  //       horizontal: 'center',
  //     },
  //     action,
  //     marginBottom: "2.5rem",
  //   });
  // }

	React.useEffect(() => {
		if (schemaInfo.schema.canvas === undefined) return;
		setCanvas(schemaInfo.schema.canvas);
	}, [schemaInfo]);

	const handleMouseEnter = React.useCallback(() => {
		setBgColor('gray');
	}, []);

	const handleMouseLeave = React.useCallback(() => {
		setBgColor('transparent');
	}, []);

	const onClickCloseHandler = React.useCallback(() => {
		onRemove(nodeId, schemaInfo.id);
	}, []);

	return (
		<div>
			{/* canvases is object */}
			<div
				style={{
					width: '100%',
					height: 26,
					maxWidth: maxWidth,
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					borderTopLeftRadius: '5px',
					borderTopRightRadius: '5px',
					color: '#fff',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingLeft: '10px',
					paddingRight: '5px',
					fontSize: '12px',
					fontWeight: '400',
					fontFamily: 'pretendard',
				}}
			>
				{schemaInfo.schema.title}
				<div
					style={{
						width: '20px',
						height: '20px',
						cursor: 'pointer',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '50%',
						backgroundColor: bgColor,
					}}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={onClickCloseHandler}
				>
					<SvgClose />
				</div>
			</div>
			<div
				key={'PanelCanvas-' + uuidv4().slice(0, 8)}
				style={{
					width: '100%',
					height: '100%',
					maxWidth: maxWidth,
					maxHeight: maxHeight,
					overflow: 'auto',
					borderLeft: '1px solid #c1c1c3',
					borderRight: '1px solid #c1c1c3',
					borderBottom: '1px solid #c1c1c3',
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					position: 'relative',
					borderBottomLeftRadius: '5px',
					borderBottomRightRadius: '5px',
					padding: '10px',
				}}
				className='nodrag nowheel'
			>
				{/* {canvas.layers.map((layer: Layer, index: number) => {
					return <ToComponent key={index} layer={layer} />;
				})} */}
				<RJSFComp schema={schemaInfo.schema} path={schemaInfo.path} enqueueSnackbar={enqueueSnackbar}/>
			</div>
		</div>
	);
}
