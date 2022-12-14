var required = (propertyType) => {
	return v => v && v.length > 0 || `Заполните объязательное поле ${propertyType}`;
}

var requiredObject = (propertyType) => {
	return v => v && !(Object.keys(v).length === 0 && v.constructor === Object) || `Заполните объязательное поле ${propertyType}`;
}

var requiredTheme = (propertyType,theme) => {
	return theme > -1 && theme != null || `Заполните объязательное поле ${propertyType}`;
}

var requiredNumber = (propertyType,ok) => {
	if(!ok) return true;

	return v => !isNaN(v) && v != null || `Заполните объязательное поле ${propertyType}`;
}

var minLength = (propertyType, minLength) => {
	return v => v && v.length >= minLength || `${propertyType} должен иметь ${minLength} и больше символов`;
}

var maxLength = (propertyType, maxLength) => {
	return v => v && v.length <= maxLength || `${propertyType} должен иметь максимум ${maxLength} символов`;
}

var emailFormat = () => {
	var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	return v => v && regex.test(v) || "Должна быть правильная почта";
}

var numberBetween = (propertyType, ok) => {
	if(!ok) return true;
	return  v => v && v >= 0 && v <= 102 || `${propertyType} должна быть между 0 и 100`;
}

var numberBetweenTest = (propertyType,ok, max) => {
	if(!ok) return true;
	return  v => v && ((v >= 0 && v <= max) || v == 102)  || `${propertyType} должна быть между 0 и ${max}`;
}
export default {
	required,
	minLength,
	maxLength,
	emailFormat,
	numberBetween,
	requiredNumber,
	requiredObject,
	numberBetweenTest,
	requiredTheme
}