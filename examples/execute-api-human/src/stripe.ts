export const stripe = `
export default async () => {
await fetch('https://api.stripe.com/v1/charges', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer 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',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    if (response.ok) {
      console.log('Stripe API is reachable:', response.status);
    } else {
      console.error('Stripe API error:', response.status, response.statusText);
    }
  })
  .catch(error => console.error('Network error:', error));
}
`;
