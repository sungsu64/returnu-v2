// src/locale/langContent.js
export const messages = {
  ko: {
    // 공통
    loading: "로딩 중...",
    error: "에러",
    errorOccurred: "에러 발생: ",
    loginRequired: "로그인이 필요합니다.",
    deleteFailed: "삭제 실패",
    deleteSuccess: "삭제 완료!",
    confirmDeleteRequest: "정말로 삭제하시겠습니까?",
    back: "뒤로가기",
    allFieldsRequired: "모든 항목을 입력해주세요.",
    serverError: "서버 오류가 발생했습니다.",

    // SettingsPage
    settings: "설정",
    changePassword: "비밀번호 변경",
    logout: "로그아웃",
    dark: "다크",
    light: "라이트",
    korean: "한국어",
    english: "English",

    // NavBar
    navCreateLost: "분실물 등록",
    navCreateFound: "습득물 등록",
    navHome: "홈",
    navLost: "분실물",
    navRequests: "요청글",
    navMy: "내정보",

    // NoticeSlider
    noticeIcon: "📢",

    // SendMessagePage
    sendMessage: "쪽지 보내기",
    receiverId: "받는 사람 학번",
    send: "전송하기",
    messageSent: "쪽지가 전송되었습니다!",
    messageSendError: "쪽지를 보낼 수 없습니다. 다시 시도해주세요.",

    // NoticeManagerPage
    noticeLoadError: "공지사항 불러오기 실패",
    titleContentRequired: "제목과 내용을 입력해주세요.",
    noticeCreated: "공지 등록 완료",
    noticeUpdated: "공지 수정 완료",
    noticeDeleted: "삭제되었습니다.",
    deleteError: "삭제 중 오류가 발생했습니다.",
    noticeManager: "공지사항 관리",
    createNotice: "공지 등록하기",
    editNotice: "공지 수정하기",
    cancel: "취소",
    edit: "수정",
    delete: "삭제",

    // MyPostsPage
    postsLoadError: "글을 불러오지 못했습니다.",
    noPosts: "게시물이 없습니다.",
    myPostsTitle: "내 글 관리",
    tabLost: "분실물",
    tabFound: "습득물",
    tabInquiry: "문의하기",
    tabFeedback: "피드백",

    // MessageSentPage
    cannotLoadSentMessages: "보낸 쪽지를 불러올 수 없습니다.",
    confirmDeleteMessage: "이 쪽지를 삭제하시겠습니까?",
    sentMessages: "보낸 쪽지함",
    noSentMessages: "보낸 쪽지가 없습니다.",
    recipient: "받는 사람",

    // MessageInboxPage
    cannotLoadMessages: "쪽지를 불러올 수 없습니다.",
    inbox: "받은 쪽지함",
    noInboxMessages: "받은 쪽지가 없습니다.",
    sender: "보낸 사람",
    reply: "답장하기",

    // MessageDetailPage
    loadFailed: "불러오기 실패",
    cannotLoadMessageInfo: "쪽지 정보를 불러올 수 없습니다.",
    loadingDetail: "불러오는 중...",
    messageDetail: "쪽지 상세",
    sentAt: "보낸 시간",

    // LostRequestPage
    lostRequestTitle: "물건을 찾아주세요!",
    exampleTitle: "예: 검정색 지갑을 잃어버렸어요",
    lostDate: "분실 날짜",
    lostLocation: "분실 장소",
    locationPlaceholder: "예: 학생회관, 도서관",
    Category: "카테고리 선택",
    descriptionPlaceholder: "잃어버린 상황을 최대한 자세히 적어주세요",
    phonePlaceholder: "010-1234-5678",
    emailPlaceholder: "email@example.com",
    photoOptional: "사진 첨부 (선택)",
    submitPost: "게시글 등록",
    fillRequiredFields: "모든 필수 항목을 입력해주세요. (전화번호 또는 이메일은 하나 이상 필수)",
    submitFailed: "등록 실패",
    requestCreated: "요청이 등록되었습니다!",

    // LostRequestListPage
    lostRequestListTitle: "물건을 찾아주세요!",
    cannotLoadRequests: "요청글을 불러올 수 없습니다.",
    noResults: "검색 결과가 없습니다.",
    sortNew: "최신순",
    sortOld: "오래된순",
    searchPlaceholder: "제목 또는 내용 검색",
    requestImageAlt: "요청 이미지",
    pageInfo: "현재 페이지: {{current}} / {{total}}",

    // LostRequestDetailPage
    categoryOther: "기타",
    locationLabel: "위치",
    dateLabel: "날짜",
    createdAtLabel: "등록일",
    none: "없음",
    descriptionLabel: "설명",
    contactLabel: "연락처",
    emailLabel: "이메일",
    cannotSendMessage: "쪽지를 보낼 수 없습니다.",

    // LostListPage
    lostListTitle: "물건을 찾아가세요!",
    cannotLoadItems: "목록을 불러올 수 없습니다.",
    statusAll: "전체",
    statusUnclaimed: "미수령",
    statusClaimed: "수령완료",
    noResultsAlt: "결과 없음",
    thumbnailAlt: "썸네일",
    statusClaimedBadge: "수령완료",
    expireLabel: "보관 기한",

    // LostCreatePage (폼 관련 라벨/플레이스홀더)
    lostCreateTitle: "분실물 등록",
    requiredNotice: "필수 항목은 모두 입력해야 합니다.",
    itemNameLabel: "물건 이름",
    itemNamePlaceholder: "예: 검정색 지갑을 잃어버렸어요",
    itemNameRequired: "물건 이름을 입력해주세요.",
    locationRequired: "분실 장소를 입력해주세요.",
    dateRequired: "분실 날짜를 선택해주세요.",
    categoryRequired: "카테고리를 선택해주세요.",
    previewLabel: "업로드된 이미지",
    previewAlt: "미리보기",
    creating: "등록 중...",
    createButton: "등록하기",
    resetButton: "초기화",
    createSuccess: "분실물 등록 완료!",
    createFailed: "등록 실패",

    // LoginPage
    loginTitle: "로그인",
    loginIdPlaceholder: "학번 (숫자만)",
    loginPwPlaceholder: "비밀번호",
    loginButton: "로그인",
    loginSuccess: "로그인 성공!",
    loginFailed: "로그인 실패",
    loginError: "❌ 로그인 실패: 아이디 또는 비밀번호를 확인하세요.",

    // InquiryListPage
    loadInquiriesFailed: "문의 목록을 불러올 수 없습니다.",
    myInquiries: "나의 문의 내역",
    writeInquiry: "문의하기",
    noInquiries: "문의 내역이 없습니다.",

    // InquiryDetailPage
    loadInquiryFailed: "문의 정보를 불러오지 못했습니다.",
    nameLabel: "이름",
    studentIdLabel: "학번",
    createdAtLabel: "작성일",
    inquiryContent: "문의 내용",
    adminReply: "관리자 답변",
    replyPlaceholder: "답변 내용을 입력해주세요",
    replyRequired: "답변 내용을 입력해주세요.",
    submitting: "등록 중...",
    submitReply: "답변 등록",
    replySuccess: "답변이 등록되었습니다.",
    replyFailed: "답변 등록에 실패했습니다.",
    noReplyYet: "아직 답변이 등록되지 않았습니다.",

    // HomePage
    all: "전체",
    lostTab: "분실물",
    foundTab: "습득물",
    loadNoticesFailed: "공지사항을 불러오지 못했습니다.",
    mainIllustrationAlt: "메인 일러스트",
    guideLine1: "분실물을 찾고 있나요?",
    guideLine2: "아래 내용을 꼭 읽어주세요!!",
    usageGuideTitle: "ReturnU 사용 가이드",
    usageGuideSearch: "검색창에 분실물을 검색해보세요.",
    usageGuideRegister: "버튼을 누르면 분실물·습득물 등록도 할 수 있어요!",

    // FAQ 챗봇
    faqTitle: "FAQ 챗봇",
    faqList: [
      { question: "물건을 주웠는데 어떻게 하나요?", answer: "학생지원팀(학생회관 1층)으로 제출해주세요." },
      { question: "찾으러 가면 뭘 가져가야 하나요?", answer: "본인 확인 가능한 신분증이 필요해요." },
      { question: "분실물은 얼마나 보관되나요?", answer: "최대 2주까지 보관되며 이후 폐기됩니다." },
      { question: "등록한 분실물을 나중에 수정하거나 삭제할 수 있나요?", answer: "네, 등록한 분실물은 [마이페이지] 또는 [내가 등록한 분실물] 메뉴에서 직접 수정하거나 삭제할 수 있습니다. 단, 이미 수령 처리된 분실물은 수정이 제한될 수 있습니다." },
      { question: "분실물을 등록할 때 사진은 반드시 첨부해야 하나요?", answer: "사진 첨부는 선택 사항입니다. 하지만 사진을 함께 등록하면 분실물을 더 쉽게 찾을 수 있으니, 가능한 경우 사진을 첨부하는 것을 권장합니다." },
      { question: "쪽지는 어디에서 어떻게 확인할 수 있나요?", answer: "쪽지는 로그인 후 [쪽지함] 또는 [마이페이지] 메뉴에서 확인할 수 있습니다. 새로운 쪽지가 도착하면 알림이 표시됩니다." }
    ],

    // EasterEggPage
    easterMessages: [
      "🍀 오늘은 뭔가 좋은 일이 생길 것 같아요!",
      "🌤️ 흐린 날도 지나고 햇살이 찾아옵니다 ☀️",
      "📱 휴대폰, 잃어버리지 않게 조심조심!",
      "🥤 오늘은 버블티 한 잔 어때요?",
      "🎧 이어폰은 제자리에 있나요? 🤔",
      "🧸 너무 지치면 조금 쉬어가도 괜찮아요!",
      "💌 누군가 당신을 응원하고 있어요!",
      "📚 공부도 중요하지만 휴식도 필수!",
      "🌸 오늘의 당신, 완전 만개한 벚꽃 같아요!",
      "🐾 누군가의 하루를 따뜻하게 해줄 수 있는 사람은 바로 당신!",
      "🧠 똑똑하고 따뜻한 당신에게 박수 짝짝!",
      "🪄 오늘은 마법 같은 하루가 될 거예요!",
      "🎁 클릭해줘서 고마워요, 깜짝 선물 받으세요~",
      "🍞 식사 거르지 말고 꼭 챙겨 먹기!",
      "🕊️ 마음이 평화롭기를 바라요~"
    ],

    // ContactPage
    contactTitle: "문의하기",
    contactDescription: "궁금한 점이나 개선사항이 있다면 아래 양식을 통해 문의해주세요.",
    namePlaceholder: "이름을 입력하세요",
    studentIdPlaceholder: "학번을 입력하세요",
    emailPlaceholder: "example@email.com",
    titlePlaceholder: "문의 제목을 입력하세요",
    messagePlaceholder: "문의 내용을 입력해주세요",
    contactSubmit: "문의 보내기",
    inquirySuccess: "문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.",
    inquiryFail: "문의 전송 실패",
    serverConnectionError: "서버 연결 오류가 발생했습니다. 다시 시도해주세요.",

    // ClaimPage
    claimTitle: "수령자 정보 입력",
    claimPlaceholder: "본인 이름 입력",
    claimProcess: "✅ 수령 처리하기",
    claimNameRequired: "이름을 입력해주세요.",
    claimServerError: "서버 오류 발생",
    claimSuccess: "✅ 수령 처리가 완료되었습니다.",

    // FoundDetailPage
    foundLoadError: "데이터를 불러오지 못했습니다.",
    foundLoading: "로딩 중...",
    foundBack: "뒤로가기",
    foundImageAlt: "분실물 이미지",
    noImage: "이미지 없음",
    foundDateLabel: "습득일",
    foundClaimedStatus: "수령 완료",
    registrationDate: "등록일",
    storagePlace: "보관 장소",
    storageLocationDetail: "학생지원센터 1층 분실물 창구",
    storageExpiryLabel: "보관 기한",
    storageExpiryDesc: "2주간 보관 후 폐기 예정입니다.",

    // AddNoticePage
    noticeTitlePlaceholder: "제목을 입력하세요",
    noticeContentPlaceholder: "내용을 입력하세요",
    noticeTitleContentRequired: "제목과 내용을 모두 입력해주세요.",
    noticeCreateFail: "등록 실패",

    // AdminInquiryListPage
    adminOnly: "관리자만 접근 가능합니다.",
    adminAllInquiries: "전체 문의 내역 (관리자 전용)",

    // EditLostItemPage, EditFoundItemPage 등은 위와 동일하게 구조 유지

    // ---- 신규 단일/유니버설 키 ----
    myPosts: "내 게시글",
    inquiryHistory: "문의 내역",
    easterEgg: "이스터에그",
    noticeRegister: "공지사항 등록",
    receivedMessages: "받은 쪽지함",
    sentMessages: "보낸 쪽지함",
    feedbackCollection: "피드백 모음",
    sent: "보낸 쪽지함",
    studentId: "학번",

    // My Info → 피드백 입력 영역
    feedbackHeading: "피드백 남기기",
    feedbackPlaceholder: "피드백을 입력하세요",
    submit: "등록",
    selectCategory:      "카테고리 선택",
    categoryRequired:    "카테고리를 선택해주세요.",

    titleLabel:        "제목",
    descriptionLabel:  "설명",
    phoneLabel:        "전화번호",
    // lostRequestPage 전용
    lostRequestTitle:      "물건을 찾아주세요!",
    exampleTitle:          "예: 검정색 지갑을 잃어버렸어요",
    lostDate:              "분실 날짜",
    lostLocation:          "분실 장소",
    locationPlaceholder:   "예: 학생회관, 도서관",
    categoryLabel:         "카테고리",
    selectCategory:        "카테고리 선택",
    descriptionPlaceholder:"잃어버린 상황을 최대한 자세히 적어주세요",
    phonePlaceholder:      "010-1234-5678",
    photoOptional:         "사진 첨부 (선택)",
    submitPost:            "게시글 등록",
    fillRequiredFields:    "모든 필수 항목을 입력해주세요. (전화번호 또는 이메일은 하나 이상 필수)",
    submitFailed:          "등록 실패",
    requestCreated:        "요청이 등록되었습니다!",
    loginRequired:         "로그인이 필요합니다.",
    errorOccurred:         "오류 발생: ",

    changePasswordTitle: "비밀번호 변경",
currentPasswordPlaceholder: "현재 비밀번호",
newPasswordPlaceholder: "새 비밀번호",
confirmPasswordPlaceholder: "새 비밀번호 확인",
changePasswordButton: "비밀번호 변경",
claimPlaceholder: "본인 이름 입력",
claimButton: "수령 처리하기",
InputClaimPlaceholder: "본인 이름 입력",

    // 폼 단일 추가
    categoryPlaceholder: "카테고리 선택",
    datePlaceholder: "연도-월-일( )",
    uploadPhotoLabel: "파일 선택",
    uploadPhotoPlaceholder: "선택된 파일 없음",
    submitButton: "제출하기"


  },

  en: {
    // Common
    loading: "Loading...",
    error: "Error",
    errorOccurred: "Error: ",
    loginRequired: "Login required.",
    deleteFailed: "Delete failed",
    deleteSuccess: "Deleted successfully!",
    confirmDeleteRequest: "Are you sure you want to delete?",
    back: "Back",
    allFieldsRequired: "Please fill in all fields.",
    serverError: "A server error occurred.",

    // SettingsPage
    settings: "Settings",
    changePassword: "Change Password",
    logout: "Logout",
    dark: "Dark",
    light: "Light",
    korean: "Korean",
    english: "English",

    // NavBar
    navCreateLost: "Report Lost",
    navCreateFound: "Report Found",
    navHome: "Home",
    navLost: "Lost",
    navRequests: "Requests",
    navMy: "My Page",

    // NoticeSlider
    noticeIcon: "📢",

    // SendMessagePage
    sendMessage: "Send Message",
    receiverId: "Receiver ID",
    send: "Send",
    messageSent: "Message sent successfully!",
    messageSendError: "Unable to send message. Please try again.",

    // NoticeManagerPage
    noticeLoadError: "Failed to load notices",
    titleContentRequired: "Please enter title and content.",
    noticeCreated: "Notice created successfully",
    noticeUpdated: "Notice updated successfully",
    noticeDeleted: "Deleted successfully.",
    deleteError: "Error occurred while deleting.",
    noticeManager: "Notice Management",
    createNotice: "Create Notice",
    editNotice: "Edit Notice",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",

    // MyPostsPage
    postsLoadError: "Failed to load posts.",
    noPosts: "No posts available.",
    myPostsTitle: "My Posts",
    tabLost: "Lost",
    tabFound: "Found",
    tabInquiry: "Inquiry",
    tabFeedback: "Feedback",

    // MessageSentPage
    cannotLoadSentMessages: "Cannot load sent messages.",
    confirmDeleteMessage: "Delete this message?",
    sentMessages: "Sent Messages",
    noSentMessages: "No sent messages.",
    recipient: "Recipient",

    // MessageInboxPage
    cannotLoadMessages: "Can’t load messages.",
    inbox: "Inbox",
    noInboxMessages: "No messages.",
    sender: "Sender",
    reply: "Reply",

    // MessageDetailPage
    loadFailed: "Load failed",
    cannotLoadMessageInfo: "Cannot load message info.",
    loadingDetail: "Loading...",
    messageDetail: "Message Detail",
    sentAt: "Sent At",

    // LostRequestPage
    lostRequestTitle: "Please request a lost item!",
    exampleTitle: "Ex: Lost my black wallet",
    lostDate: "Lost Date",
    lostLocation: "Lost Location",
    locationPlaceholder: "Ex: Student Hall, Library",
    selectCategory: "Select Category",
    descriptionPlaceholder: "Describe the situation in detail",
    phonePlaceholder: "010-1234-5678",
    emailPlaceholder: "email@example.com",
    photoOptional: "Attach Photo (Optional)",
    submitPost: "Submit Request",
    fillRequiredFields: "Please fill all required fields (phone or email required)",
    submitFailed: "Submit failed",
    requestCreated: "Request submitted!",

    // LostRequestListPage
    lostRequestListTitle: "Lost Requests",
    cannotLoadRequests: "Cannot load requests.",
    noResults: "No results.",
    sortNew: "Newest",
    sortOld: "Oldest",
    searchPlaceholder: "Search title or description",
    requestImageAlt: "Request Image",
    pageInfo: "Page {{current}} / {{total}}",

    // LostRequestDetailPage
    categoryOther: "Other",
    locationLabel: "Location",
    dateLabel: "Date",
    createdAtLabel: "Created At",
    none: "None",
    descriptionLabel: "Description",
    contactLabel: "Contact",
    cannotSendMessage: "Cannot send message.",

    // LostListPage
    lostListTitle: "Pick up your items!",
    cannotLoadItems: "Cannot load list.",
    statusAll: "All",
    statusUnclaimed: "Unclaimed",
    statusClaimed: "Claimed",
    noResultsAlt: "No results.",
    thumbnailAlt: "Thumbnail",
    statusClaimedBadge: "Claimed",
    expireLabel: "Expiry",

    // LostCreatePage
    lostCreateTitle: "Register Lost Item",
    requiredNotice: "All fields marked * are required.",
    itemNameLabel: "Item Name",
    itemNamePlaceholder: "Ex: I lost my black wallet",
    itemNameRequired: "Please enter an item name.",
    locationRequired: "Please enter a location.",
    dateRequired: "Please select a date.",
    categoryRequired: "Please select a category.",
    previewLabel: "Uploaded Image",
    previewAlt: "Preview",
    creating: "Creating...",
    createButton: "Create",
    resetButton: "Reset",
    createSuccess: "Item registered!",
    createFailed: "Registration failed",

    // LoginPage
    loginTitle: "Login",
    loginIdPlaceholder: "Student ID (numbers)",
    loginPwPlaceholder: "Password",
    loginButton: "Login",
    loginSuccess: "Login successful!",
    loginFailed: "Login failed",
    loginError: "❌ Login failed: Check your ID or password.",

    // InquiryListPage
    loadInquiriesFailed: "Cannot load inquiries.",
    myInquiries: "My Inquiries",
    writeInquiry: "Write Inquiry",
    noInquiries: "No inquiries.",

    // InquiryDetailPage
    loadInquiryFailed: "Cannot load inquiry info.",
    nameLabel: "Name",
    studentIdLabel: "Student ID",
    emailLabel: "Email",
    createdAtLabel: "Created At",
    inquiryContent: "Inquiry",
    adminReply: "Admin Reply",
    replyPlaceholder: "Enter your reply",
    replyRequired: "Reply cannot be empty.",
    submitting: "Submitting...",
    submitReply: "Submit Reply",
    replySuccess: "Reply submitted!",
    replyFailed: "Reply submission failed.",
    noReplyYet: "No reply yet.",

    // HomePage
    all: "All",
    lostTab: "Lost Items",
    foundTab: "Found Items",
    loadNoticesFailed: "Cannot load notices.",
    mainIllustrationAlt: "Main Illustration",
    guideLine1: "Looking for lost items?",
    guideLine2: "Please read the instructions below!",
    usageGuideTitle: "ReturnU Usage Guide",
    usageGuideSearch: "Search for lost items above.",
    usageGuideRegister: "Click + to register lost/found items.",

    // FAQ chatbot
    faqTitle: "FAQ Chatbot",
    faqList: [
      { question: "What should I do if I find a lost item?", answer: "Please submit it to the Student Support Office (1F Student Hall)." },
      { question: "What should I bring to claim my lost item?", answer: "You need a valid ID for verification." },
      { question: "How long are lost items kept?", answer: "They are kept for up to 2 week, then discarded." },
      { question: "Can I edit or delete a reported lost item later?", answer: "Yes, you can edit or delete your reported items via My Page or My Reports. Once marked as claimed, editing may be restricted." },
      { question: "Is attaching a photo mandatory when reporting?", answer: "Photos are optional but recommended to help locate the item faster." },
      { question: "Where can I check my messages?", answer: "After logging in, check ‘Messages’ or ‘My Page’. You’ll see notifications when new messages arrive." }
    ],

    // EasterEggPage
    easterMessages: [
      "🍀 Something good is bound to happen today!",
      "🌤️ Cloudy days pass and the sun returns ☀️",
      "📱 Be careful not to lose your phone!",
      "🥤 How about a bubble tea today?",
      "🎧 Are your earphones in place? 🤔",
      "🧸 It’s okay to rest if you’re tired!",
      "💌 Someone is cheering for you!",
      "📚 Rest is as important as study!",
      "🌸 You’re blooming like a cherry blossom!",
      "🐾 You can warm someone’s day!",
      "🧠 Kudos to your smart & kind self!",
      "🪄 Today will be magical!",
      "🎁 Thanks for clicking—surprise gift!",
      "🍞 Don’t skip meals—eat well!",
      "🕊️ Wishing you peace of mind~"
    ],

    // ContactPage
    contactTitle: "Contact Us",
    contactDescription: "Got questions or suggestions? Reach out via the form below.",
    namePlaceholder: "Enter your name",
    studentIdPlaceholder: "Enter your student ID",
    emailPlaceholder: "example@email.com",
    titlePlaceholder: "Enter the subject",
    messagePlaceholder: "Enter your message",
    contactSubmit: "Submit Inquiry",
    inquirySuccess: "Your inquiry has been received. We will respond soon.",
    inquiryFail: "Failed to send inquiry",
    serverConnectionError: "A connection error occurred. Please try again.",

    // ClaimPage
    claimTitle: "Enter Recipient Name",
    claimPlaceholder: "Enter your name",
    claimProcess: "✅ Confirm Claim",
    claimNameRequired: "Please enter a name.",
    claimServerError: "Server error occurred",
    claimSuccess: "✅ Claim processed successfully.",

    // FoundDetailPage
    foundLoadError: "Failed to load data.",
    foundLoading: "Loading...",
    foundBack: "Back",
    foundImageAlt: "Found item image",
    noImage: "No image",
    foundDateLabel: "Found Date",
    foundClaimedStatus: "Claimed",
    registrationDate: "Registered On",
    storagePlace: "Storage Location",
    storageLocationDetail: "Student Support Center 1F Lost & Found",
    storageExpiryLabel: "Expiry Date",
    storageExpiryDesc: "Items kept 2 weeks then discarded.",

    // …기존…
    titleLabel:        "Title",
    descriptionLabel:  "Description",
    phoneLabel:        "Phone",
    // lostRequestPage 전용
    lostRequestTitle:      "Request a Lost Item!",
    exampleTitle:          "Ex: I lost my black wallet",
    lostDate:              "Date Lost",
    lostLocation:          "Location Lost",
    locationPlaceholder:   "Ex: Student Hall, Library",
    categoryLabel:         "Category",
    selectCategory:        "Select Category",
    descriptionPlaceholder:"Describe the situation in detail",
    phonePlaceholder:      "010-1234-5678",
    emailPlaceholder:      "example@email.com",
    photoOptional:         "Attach Photo (Optional)",
    submitPost:            "Submit",
    fillRequiredFields:    "Please fill all required fields (phone or email required)",
    submitFailed:          "Submission failed",
    requestCreated:        "Request submitted!",
    loginRequired:         "Login required.",
    errorOccurred:         "Error: ",


    // AddNoticePage
    noticeTitlePlaceholder: "Enter title",
    noticeContentPlaceholder: "Enter content",
    noticeTitleContentRequired: "Please enter both title and content.",
    noticeCreateFail: "Creation failed",

    //myinfo
    feedbackHeading: "Feedback",
    feedbackPlaceholder: "Enter your feedback",
    submit: "Submit",

    // AdminInquiryListPage
    adminOnly: "Admin access only.",
    adminAllInquiries: "All Inquiries (Admin Only)",

    // ---- 신규 단일/유니버설 키 ----
    myPosts: "My Posts",
    inquiryHistory: "Inquiry History",
    easterEgg: "Easter Egg",
    noticeRegister: "Register Notice",
    receivedMessages: "Inbox",
    feedbackCollection: "Feedback Collection",
    sent: "Sent",
    studentId: "Student ID",

    changePasswordTitle: "Change Password",
    currentPasswordPlaceholder: "Current Password",
    newPasswordPlaceholder: "New Password",
    confirmPasswordPlaceholder: "Confirm New Password",
    changePasswordButton: "Change Password",
    claimPlaceholder: "Enter your name",
claimButton: "Claim",
InputClaimPlaceholder: "Enter your name",

    

    // 폼 단일 추가
    categoryPlaceholder: "Category label",
    datePlaceholder: "YYYY-MM-DD",
    uploadPhotoLabel: "Choose File",
    uploadPhotoPlaceholder: "No file selected",
    submitButton: "Submit"
  }
};
