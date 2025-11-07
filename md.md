atualmente o sistema **identifica o serviço pela descrição**, e não por um **código fixo (ID único)**.
Por isso, se a descrição muda, o sistema entende que é outro serviço — e isso pode quebrar o vínculo entre o front e o back.

**Exemplo prático:**

Suponha que no banco temos:

```json
{
  "codigo": "123",
  "descricao": "Propina Fisioterapia 2024",
  "preco": 59800
}
```

No front usamos a descrição para buscar e montar a fatura:

```ts
GET /servicos?descricao=Propina Fisioterapia 2024
```

Agora, se no próximo ano o nome mudar para:

```json
{
  "codigo": "123",
  "descricao": "Propina Fisioterapia 2025",
  "preco": 65000
}
```

O front deixa de encontrar o serviço, porque ele buscava pela descrição antiga.
➡️ Resultado: a integração “quebra”, e parece que o serviço “sumiu”.

---

**Solução proposta:**
Criar um identificador único e fixo, por exemplo:

```json
{
  "sigla": "PROP_FISIO",
  "descricao": "Propina Fisioterapia 2025",
  "ano_letivo": 2025,
}
```

Assim, o front e o back continuam comunicando pelo `sigla` (que não muda):

```ts
GET /servicos?sigla=PROP_FISIO
```

E, conforme a regra da AGT, podemos inativar o serviço antigo e criar o novo — mas sem afetar o vínculo técnico entre os sistemas.
