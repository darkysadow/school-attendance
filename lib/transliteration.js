//Use only with saving an original text
//Because reverse-transliteration can contain letter mistakes

export function transliterate(text) {
    const cyrillic = [
        'а', 'б', 'в', 'г', 'ґ', 'д', 'е', 'є', 'ж', 'з', 'и', 'і', 'ї', 'й', 'к', 'л', 'м', 'н', 'о', 'п',
        'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я', ' '
    ];

    const latin = [
        'a', 'b', 'v', 'h', 'g', 'd', 'e', 'ie', 'zh', 'z', 'y', 'i', 'i', 'i', 'k', 'l', 'm', 'n', 'o', 'p',
        'r', 's', 't', 'u', 'f', 'kh', 'ts', 'ch', 'sh', 'shch', '', 'iu', 'ia', '-'
    ];

    return text.toLowerCase().split('').map(char => {
        const index = cyrillic.indexOf(char.toLowerCase());
        return index !== -1 ? (char === char.toUpperCase() ? latin[index].toUpperCase() : latin[index]) : char;
    }).join('');
  }