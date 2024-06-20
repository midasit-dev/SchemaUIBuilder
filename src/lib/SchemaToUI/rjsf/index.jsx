import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import Button from '@mui/material/Button';

const log = (type) => console.log.bind(console, type);

export default function RJSFComp(props) {
	const { schema, path, enqueueSnackbar } = props;
	const [isloading, setIsloading] = React.useState(false);
	const [response, setResponse] = React.useState({});

	console.log('schema', schema);

	async function postFunctionExecute(body) {
		// https://moa.rpm.kr-dv-midasit.com/backend/function-executor/python-execute/moapy/project/wgsd/wgsd_flow/rebar_properties_design
		const res = fetch(
			`${process.env.REACT_APP_API_URL}backend/function-executor/python-execute${path}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				enqueueSnackbar('Success', { variant: 'success' });
				console.log(data);
			});
	}


	function onSubmit(data) {
		setIsloading(true);
		console.log('submitted', data.formData);
		postFunctionExecute(data.formData);
		setIsloading(false);
	}

	return (
		<Form
			schema={schema}
			validator={validator}
			onChange={log('changed')}
			onSubmit={onSubmit}
			onError={log('errors')}
		>
			<button
				type='submit'
				className='btn btn-primary'
				style={{
					width: '100%',
					position: 'fixed',
					bottom: 0,
					left: 0,
					backgroundColor: 'rgba(255,255,255,0.7)',
					height: '30px',
					padding: 0,
					margin: 0,
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
					border: '1px solid #c1c1c3',
					color: 'black',
				}}
			>
				Run
			</button>
		</Form>
	);
}
