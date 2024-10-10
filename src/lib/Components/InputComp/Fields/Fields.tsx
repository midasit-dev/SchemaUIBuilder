import { ReactElement, useEffect, useState } from 'react';
import './Fields.css';
import {
	FieldsProps,
	getCustomField,
	getUpdatedForm,
	renderField,
	SchemaForm,
	SchemaPropertyMap,
} from './FieldsUtil';

export default function Fields(props: FieldsProps) {
	const { formData, schema, onChange } = props;
	const [tmp, setTmp] = useState(true);
	const [hideSchemaKeys, setHideSchemaKeys] = useState<string[]>([]);

	const handleHideSchemaKey = (schemaKey: string) => {
		if (hideSchemaKeys.includes(schemaKey)) {
			setHideSchemaKeys(hideSchemaKeys.filter((key) => key !== schemaKey));
		} else {
			setHideSchemaKeys([...hideSchemaKeys, schemaKey]);
		}
	};

	const handleChange = (keyList: string[], value: string) => {
		const newFormData = getUpdatedForm(formData, keyList, value);
		onChange(newFormData);
		setTmp(!tmp);
	};

	const renderFields = (
		properties: SchemaPropertyMap,
		form: SchemaForm,
		keyList: string[],
	): ReactElement[] => {
		return Object.entries(properties).map(([fieldKey, field]) => {
			const currentForm = form[fieldKey];
			const currentKeyList = [...keyList, fieldKey];

			const renderChildFields = (childProperties: SchemaPropertyMap) => {
				return (
					<>
						<div className={'field-title'}>{field.title}</div>
						{renderFields(childProperties, currentForm as SchemaForm, currentKeyList)}
					</>
				);
			};

			const childProperties = field.properties;
			if (childProperties) {
				const valueProperty = childProperties['value'];
				const unitProperty = childProperties['unit'];

				const isUnitValue = valueProperty !== undefined && unitProperty !== undefined;
				if (!isUnitValue) {
					return renderChildFields(childProperties);
				}

				const { title, description } = field;
				const defaultData = field.default as { value: number; unit: string };

				const value = (defaultData?.value.toString() || (valueProperty.default as string)) ?? '';
				const unit = defaultData?.unit || (unitProperty.enum?.[0] as string);

				return renderField(
					{ ...valueProperty, title, description, unit },
					value,
					(value: string) => {
						handleChange([...currentKeyList, 'value'], value);
					},
				);
			}

			if (field.anyOf) {
				return (
					<>
						{field.anyOf
							.filter((item) => item.properties)
							.map((anyOfSchema) => {
								return renderChildFields(anyOfSchema.properties!);
							})}
					</>
				);
			}

			const customField = getCustomField(fieldKey, {
				formData: currentForm as SchemaForm,
				schema: properties,
				onChange: (value: string) => handleChange(currentKeyList, value),
			});

			if (customField) {
				return (
					<div className={'field-content-col'}>
						<div className={'field-title'}>{field.title}</div>
						{customField}
					</div>
				);
			}

			const value = currentForm as string;
			return renderField(field, value, (value: string) => handleChange(currentKeyList, value));
		});
	};

	return (
		<div className={'schema-container'}>
			{Object.entries(schema.properties).map(([schemaKey, schemaProperty]) => {
				if (!schemaProperty.properties) {
					return <></>;
				}

				const currentForm = formData[schemaKey] as SchemaForm;
				const keyList = [schemaKey];
				const isHide = hideSchemaKeys.includes(schemaKey);

				return (
					<div key={schemaKey} className={'schema-item'}>
						<div
							className={`schema-title ${isHide && 'hide'}`}
							onClick={() => {
								handleHideSchemaKey(schemaKey);
							}}
						>
							{schemaProperty.title}
						</div>
						{!isHide && (
							<div className={'schema-content'}>
								{renderFields(schemaProperty.properties, currentForm, keyList)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
