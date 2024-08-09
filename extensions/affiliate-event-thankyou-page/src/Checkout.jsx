import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useApi,
  useAttributeValues,
  useSubtotalAmount,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension, analytics } = useApi();
  const cost = useSubtotalAmount();

  // Get affiliate IDs in cart/checkout attributes 
  const [id_a, id_b] = useAttributeValues(["__id_a", "__id_b"]);
  console.log("__id_a :", id_a);
  console.log("__id_b :", id_b);

  // Send an event to the analytics service
  if(id_a && id_b) {
    analytics.publish("checkout_affiliate_event", {
      id_a: `${id_a}`,
      id_b: `${id_b}`,
      price: `${cost.amount}`,
    })
    .catch((error) => {
      console.log('failed to publish event');
      console.log('error', error);
    });
  }

  // Render a UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="affiliate-event-thankyou-page">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>
    </BlockStack>
  );
}