import CustomTabContent from "@/components/CustomTabContent"
import ProfileTabs from "@/components/profile/ProfileTabs"
import AccountDetailsContent from "@/components/profile/tabcontent/AccountDetailsContent"
import Orders from "@/components/profile/tabcontent/Orders"
import RootPage from "@/components/shared/RootPage"

export default function Profile({ params } : { params: { id: string } }) {
  return(
    <RootPage>
      <ProfileTabs>
        <CustomTabContent tabKey="first">
          <AccountDetailsContent />
        </CustomTabContent>
        
        <CustomTabContent tabKey="second">
          <Orders orderId={params.id} />
        </CustomTabContent>
      </ProfileTabs>
    </RootPage>
  );
}