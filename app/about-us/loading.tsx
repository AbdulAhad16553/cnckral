import Layout from "@/components/Layout";
import PageDetailSkeleton from "@/common/Skeletons/PageDetail";

export default async function AboutUsLoading() {
  return (
    <Layout>
      <PageDetailSkeleton />
    </Layout>
  );
}
