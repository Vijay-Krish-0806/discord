interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default function ConversationPage({ params }: MemberIdPageProps) {
  return (
    <>
      <div>conversation</div>
    </>
  );
}
