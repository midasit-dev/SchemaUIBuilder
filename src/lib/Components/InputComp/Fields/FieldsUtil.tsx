import MatlConcCurveUls from './Curve_uls_sls';
import PolygonField from './Polygon';
import LcomFixedField from './Lcom_Fixed';
import LcomField from './Lcom';
import { ReactElement } from 'react';
import { NumberWidget, OptionWidget, StringWidget } from '../Widgets';

export interface SchemaForm {
	[key: string]: SchemaForm | string | number | { value: number };
}

export interface SchemaProperty {
	title: string;
	type: 'string' | 'number' | 'object';
	description?: string;
	default: string | number | { value: number; unit: string };
	enum?: string[];
	anyOf?: SchemaProperty[];
	unit?: string;
	properties?: SchemaPropertyMap;
}

export interface SchemaPropertyMap {
	[key: string]: SchemaProperty;
}

export interface FieldsProps {
	formData: SchemaForm;
	schema: { properties: SchemaPropertyMap };
	onChange: (data: any) => void;
}

export interface CustomFieldProps {
	formData: SchemaForm;
	schema: SchemaPropertyMap;
	onChange: (value: string) => void;
}

export const getUpdatedForm = (form: SchemaForm, keyList: string[], value: string) => {
	if (keyList.length === 0) {
		return form;
	}

	const [currentKey, ...restKeys] = keyList;
	if (!(currentKey in form) || typeof form[currentKey] !== 'object') {
		form[currentKey] = {};
	}

	if (restKeys.length === 0) {
		const numValue = Number(value);
		form[currentKey] = value === '' || Number.isNaN(numValue) ? value : numValue;
		return form;
	}

	getUpdatedForm(form[currentKey] as SchemaForm, restKeys, value);
	return form;
};

export const getCustomField = (fieldKey: string, customProps: CustomFieldProps) => {
	switch (fieldKey) {
		case 'curve_uls':
			return <MatlConcCurveUls {...customProps} />;
		case 'curve_sls':
			return <MatlConcCurveUls {...customProps} />;
		case 'points':
		case 'innerPolygon':
		case 'outerPolygon':
			return <PolygonField {...customProps} />;
		case 'lcom':
			return <LcomFixedField {...customProps} />;
		case 'lcoms':
			return <LcomField {...customProps} />;
		default:
			return;
	}
};

export const renderField = (
	field: SchemaProperty,
	value: string,
	handleChange: (value: string) => void,
): ReactElement => {
	return (
		<div className={'field-content'}>
			<div className={'field-name'}>{field.title}</div>
			{field.enum ? (
				<OptionWidget field={field} value={value} handleChange={handleChange} />
			) : field.type === 'number' ? (
				<NumberWidget field={field} value={value} handleChange={handleChange} />
			) : (
				<StringWidget field={field} value={value} handleChange={handleChange} />
			)}
		</div>
	);
};
