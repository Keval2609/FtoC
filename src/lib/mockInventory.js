/**
 * Mock inventory data for the Farmer Dashboard.
 * In production this would come from Firestore via /farmers/:id/inventory subcollection.
 */
export const mockInventory = [
  {
    id: 'inv-001',
    name: 'Heirloom Tomatoes',
    subtitle: 'Vine-ripened, Organic',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjAdof4jTKLApWENz_MJb0FOurDK7vV6Lu3uLougdUoqRAb7NvhUVwxmC07FD4endRFmYWmYx8Hj74x1B7oB9Ll__m59K2bXhnX1tZf9lDS2hckwuKVQtopOSHhjHS7RPlWzENj_7XTE2_oULrHtDZF_NpvKS7qJoSr_mmLpqq-rNq8YVYrlC7ozueJ9gZJG3Dpqlk5g0TTkiX4MGIeHaSJpKjvOpOUdaOo9z3HreK9_HojAC_XtxBZfQtAQSDqSZT6hAqNxGVU2Vv',
    stock: 150,
    unit: 'lbs',
    price: 4.50,
    priceUnit: 'lb',
    status: 'in-stock', // 'in-stock' | 'low-stock' | 'out-of-stock'
  },
  {
    id: 'inv-002',
    name: 'Organic Lacinato Kale',
    subtitle: 'Freshly Harvested',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnHdNmnvyO99noSU6MffXVJ7VAd8vMpb1HJzSkMRZmHrs8BcKOpi-8tdQYE6vZ0QRaX03ZC9_x8WcoMfhQBY77533DPiyrCrs3X3gkmnpPoeWXoLGjpNAxi2qSO2y3WO3AIG1nse3XkG4ElS6KWNVNBJ-iJDqIY1crcyTtbjVB-7WBvy67_h4-oGtyB_LrJQiFG-6FqIsMJFOgTo_YtnL5aenn4ODTLg-WcFY6KlZEfXmOR_IRa7v4UJNZ8QO8hasL7esWU4sTmeTi',
    stock: 12,
    unit: 'bunches',
    price: 3.00,
    priceUnit: 'bunch',
    status: 'low-stock',
  },
  {
    id: 'inv-003',
    name: 'Rainbow Carrots',
    subtitle: 'Washed, Bunch',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7MC-ybM4ETcfOmwk5vzb3_bDLmi0BhTQyPBJNuSIO3voNnERY4z_VVNXp3uC3VpvRcGZNYb82REZGE9-3bgySPfQM0WSSooTEabvzHam_vckwrvRVm1079hgAyteRxxlczPrYT0Jc0Gg_2pYgLNqU6pPl3By9EY86rru04LwwqCaM-1M2NsULpUqM1Ltim8ZQxuGXAhzHEZJccyGesos-ou1EI1N8x89OC9WfeQim37mlsaKoP-oipxel_jWiipuOCMvIu2f3Qejt',
    stock: 85,
    unit: 'bunches',
    price: 4.00,
    priceUnit: 'bunch',
    status: 'in-stock',
  },
  {
    id: 'inv-004',
    name: 'Spring Mix Greens',
    subtitle: 'Cut this morning',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9azHphcY7uhGyxmg_AOe6xpTN0uMO9nTflDPzPM7vnHktJIVeiDFkhJtsFAq5sZYf6xRCn2Tw683GOLyqp5oqrv6qMgPJjONEQlszwyi2kfM0XLRyh8AK-AH4GtC4Yx809A8agSpHUMPPyZ1FOOT5dbq8stulbiHraBNlBOIRBhZmtpNHfh_QUZGgzUAvBkmrCDRYd-WvY630gaXT9owkeNnBTtDr0jq_o7abDQCp9nldYi5p87bgZOAeUk6rNfTthHavtuMfQXe',
    stock: 0,
    unit: 'bags',
    price: 5.00,
    priceUnit: '8 oz bag',
    status: 'out-of-stock',
  },
  {
    id: 'inv-005',
    name: 'Pasture-Raised Eggs',
    subtitle: 'Free-range, collected daily',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWtHQxmngLJBC3W-wdCS2Wr3IXY2zsck76FKDHwYD0cTNEwxsgoJWpnerypv28jjFS_OFODUk9VVtVh8rxT5MYsJtdt7Wf-qgqE2VcaSbj4-jxD5BxR7WAw-yhYPHoFjSMQC0KcjixSFKbEWrNgOfWQFQbBOZrZAuQAdwfeYTa1v1ht68Ic6CFCO6J4d1v_W8YSDDrtB3XYdRtXU_ibmfGam5aYPReAiZK7RqkjcOa0yT9n4K3bySCSYkJLBx75WAuxR8nxjxwR-xi',
    stock: 48,
    unit: 'dozens',
    price: 6.50,
    priceUnit: 'dozen',
    status: 'in-stock',
  },
];
