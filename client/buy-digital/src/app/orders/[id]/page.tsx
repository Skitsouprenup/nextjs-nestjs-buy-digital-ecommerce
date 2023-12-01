import OrderPage from "@/components/orders/OrderPage";
import RootPage from "@/components/shared/RootPage";

export default function OrderDetailsPage({ params } : { params: { id: string } }) {

  return (
    <RootPage>
      <OrderPage orderId={params.id} />
    </RootPage>
  )
}