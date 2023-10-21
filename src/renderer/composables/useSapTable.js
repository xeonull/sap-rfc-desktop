/*
  Converts an array of objects { FIELDNAME: ___ VALUE: ___ }
  to SAP Option structure
*/
export function useSapOption(rawFieldValues) {
  const filter = []; // Условия фильтрации для всех полей

  rawFieldValues.forEach((e) => {
    const fieldValues = e.VALUE.split(',');
    const filterOne = []; // Условия фильтрации для одного поля
    fieldValues.forEach((ee) => {
      if (ee) {
        if (ee.indexOf('*') > -1) filterOne.push(`${filterOne.length > 0 ? `OR ` : ``}${e.FIELDNAME} LIKE '${ee.replaceAll('*', '%').trim()}'`);
        else filterOne.push(`${filterOne.length > 0 ? `OR ` : ``}${e.FIELDNAME} EQ '${ee.trim()}'`);
      }
    });
    if (filterOne.length > 0) {
      filterOne[0] = filter.length > 0 ? `AND ( ${filterOne[0]}` : `( ${filterOne[0]}`; // Добавляем в начало 'AND', если ранее уже были добавлены другие поля в фильтр и '( '
      filterOne.push(`${filterOne.pop()} )`); // Добавляем в конец ' )'
    }
    filter.push(...filterOne);
  });

  return { filter };
}
