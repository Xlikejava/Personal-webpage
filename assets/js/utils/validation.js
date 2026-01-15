export function validateField(field) {
  const validity = field.validity;
  if (validity.valid) return "";

  if (validity.valueMissing) return "此项为必填项";
  if (validity.typeMismatch && field.type === "email")
    return "请输入有效的邮箱地址";
  if (validity.tooShort) return `至少需要 ${field.minLength} 个字符`;
  if (validity.tooLong) return `不能超过 ${field.maxLength} 个字符`;

  return "请输入有效的内容";
}

