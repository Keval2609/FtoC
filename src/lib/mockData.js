/**
 * Mock data matching the Stitch design screens exactly.
 * Used when VITE_USE_MOCK_DATA=true (default for development).
 */

export const mockFarmers = [
  {
    id: 'sunrise-valley',
    name: 'Sunrise Valley Farm',
    ownerName: 'Sarah Jenkins',
    story: 'Nestled in the rolling hills, Willow Creek Farm has been committed to regenerative agriculture since long before it was a trend. We believe that healthy soil creates healthy plants, which in turn nourish healthy communities. Our approach is hands-on, patient, and deeply respectful of the natural rhythms of the seasons.',
    location: 'Portland, Oregon',
    established: '1978',
    distance: '12 mi',
    verificationStatus: 'verified',
    verificationNote: 'Practices verified by direct soil sampling on Oct 2023.',
    directPercentage: 100,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoeGa6xV9y4WQ7vnWijJkQ9c-8us0skO0__ShtLaMtRTBikXZ5FaAuhTJmgrL0ccDjHC6aGeLTNaECNnH24FzS3KSbis_Nw0HOzxN4F2oey3o0-KEjP-lRKX_QVL_9Vldbe4Hjfu8M26b0nQASaJILyjYRKvVov9ayO5oYiVSyg9ME7dZpSuA1YGRhLsbVkNMsLwLOXxE7Wn6xObjCcTGQxgYbeDR-iMNmNiHHcrj5tC6gb_ya2-jcmV6JT4inJxtrqA0zgauddBmd',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOg4p15VNAU2MEEWHYUTEj7cc9di4MiWGZXjOvNCZXbIp7K1YBLHszaSJTXvD9XW-TkoaGrVWyF69Yb_3bnc61T0-hvD-a7KXKzkxNThJOa592e42uJAmz9fUSHgcwQcuDXUdCrKaExRJgvwMHbvedYGjzvJxkqV_ptxDqAsAIpLL7EoFAiSrI9joYCc_lkA0ocOJ0pnMGOFfpzHXY6daKeUjYM8Loe8MH8tNE2lv_GnL5Am-TjGJN36EJ6kB2cEpPfV8lH8XM5yVs',
    primaryProducts: ['Heirloom Tomatoes', 'Leafy Greens'],
    methods: [
      { title: 'No-Till Farming', icon: 'eco', description: 'Preserving soil structure and promoting complex microbial life beneath the surface.' },
      { title: 'Rainwater Harvesting', icon: 'water_drop', description: 'Utilizing natural catchments to minimize our reliance on external water sources.' },
      { title: 'Biological Pest Control', icon: 'pest_control', description: 'Encouraging beneficial insects rather than relying on synthetic chemical interventions.' },
    ],
    certifications: [
      { name: 'USDA Organic Certified', icon: 'description', issuedDate: 'Jan 2023', certId: 'ORG-84729', description: 'Full adherence to national organic program standards for soil quality and pest management.' },
      { name: 'Soil Health Audit', icon: 'science', issuedDate: 'Oct 2023', certId: 'TerraMetrics', description: 'Independent lab results confirm high microbial diversity and zero synthetic residues.' },
    ],
  },
  {
    id: 'oak-heritage',
    name: 'Oak Heritage Orchards',
    ownerName: 'The Miller Family',
    story: 'For four generations, the Miller family has tended these orchards with care and respect. Our heritage apple varieties are grown using time-tested organic methods that prioritize flavor and nutrition over shelf life.',
    location: 'Hood River, Oregon',
    established: '1952',
    distance: '24 mi',
    verificationStatus: 'verified',
    verificationNote: 'Organic certification verified on Aug 2023.',
    directPercentage: 85,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQGfnOu7t6__-7ti95kzrtd__JJtgFuCTZJS0G7H1P9SIjGox1wqG-E_nQtePcO8JHQ8qG-wbz3yozpqfOTOiTeYz9yzbeLd0NBvpBg3UcmObnBKZwsg6qEHF0nA4HqEhL0VKsaV9YkDXVBRfVeorQ8wDNyQmHnq1KADdsiUx_mgAhSQCMR90J2VKS5Jke-GUsjKzhTKHpzk_gHuNcJAhfUEo86FWqqC5G6pRAZhO3x8M7BPhnRDSq-CA669NssZPeAltRrMHps8G',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQGfnOu7t6__-7ti95kzrtd__JJtgFuCTZJS0G7H1P9SIjGox1wqG-E_nQtePcO8JHQ8qG-wbz3yozpqfOTOiTeYz9yzbeLd0NBvpBg3UcmObnBKZwsg6qEHF0nA4HqEhL0VKsaV9YkDXVBRfVeorQ8wDNyQmHnq1KADdsiUx_mgAhSQCMR90J2VKS5Jke-GUsjKzhTKHpzk_gHuNcJAhfUEo86FWqqC5G6pRAZhO3x8M7BPhnRDSq-CA669NssZPeAltRrMHps8G',
    primaryProducts: ['Heritage Apples', 'Stone Fruit'],
    methods: [
      { title: 'Cover Cropping', icon: 'grass', description: 'Planting cover crops between seasons to build soil health and prevent erosion.' },
      { title: 'Integrated Pest Management', icon: 'bug_report', description: 'A balanced approach using natural predators and minimal intervention.' },
      { title: 'Composting', icon: 'recycling', description: 'All orchard waste is composted and returned to the soil in a closed-loop system.' },
    ],
    certifications: [
      { name: 'Oregon Tilth Organic', icon: 'description', issuedDate: 'Aug 2023', certId: 'OT-33021', description: 'Certified organic practices meeting Oregon Tilth standards for produce safety.' },
    ],
  },
  {
    id: 'deep-roots',
    name: 'Deep Roots Collective',
    ownerName: 'Community Farm Co-op',
    story: 'Deep Roots is a community-run cooperative that believes in the power of collective farming. Our members share knowledge, resources, and the harvest, creating a resilient local food system.',
    location: 'Beaverton, Oregon',
    established: '2015',
    distance: '8 mi',
    verificationStatus: 'pending',
    verificationNote: 'Verification currently under review.',
    directPercentage: 100,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsxIQlHJlUzp5iSN0UzFjHRwM_QSYa3gmTiyHdnyW-e83dvwzPTyVzk9LMwsHOuoLesebhLWqDSN2W4Op47rpgdoiGtWs_mpC9_vN6tISxSdnkL6aMNgS-fsJxGg8yxfBkzt92UUD24dwKYsVmhz0Vda7a8MQJXNvsc54KlGxpjXVG45NtTFOd_lebunhJoNaVo4LGfycl9zARVMkiBHLDPKDBBEdNurgPi5O8z_U7GFfF6AqxMv4N-DDsVleqYybzBeabwPGvrRQF',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsxIQlHJlUzp5iSN0UzFjHRwM_QSYa3gmTiyHdnyW-e83dvwzPTyVzk9LMwsHOuoLesebhLWqDSN2W4Op47rpgdoiGtWs_mpC9_vN6tISxSdnkL6aMNgS-fsJxGg8yxfBkzt92UUD24dwKYsVmhz0Vda7a8MQJXNvsc54KlGxpjXVG45NtTFOd_lebunhJoNaVo4LGfycl9zARVMkiBHLDPKDBBEdNurgPi5O8z_U7GFfF6AqxMv4N-DDsVleqYybzBeabwPGvrRQF',
    primaryProducts: ['Root Vegetables', 'Herbs'],
    methods: [
      { title: 'Permaculture Design', icon: 'forest', description: 'Designing farm systems that mimic natural ecosystems for long-term sustainability.' },
      { title: 'Seed Saving', icon: 'spa', description: 'Preserving heirloom varieties through careful seed selection and storage.' },
      { title: 'Community Education', icon: 'school', description: 'Regular workshops teaching sustainable farming to the next generation.' },
    ],
    certifications: [],
  },
];

export const mockProducts = {
  'sunrise-valley': [
    { id: 'sv-tomatoes', name: 'Heirloom Tomatoes', price: 4.50, unit: 'Per lb', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEVqElq9iqpvMqHCXk0GK3tHWqRkz1nQjWP3FepCUdv8aIoZ7yukNy3hss3EAbT_BDP3RGWFpdgUhRXesKxpDHIHLNyndTBwUCK6lpeprrYA7iX_BehVp6bdO6vP3ADSn91p1X92w9ltHXO7Q4xKzMPjGdhQ8mT8r8N9VJjNE2phUs6Cpn5ILmmKiXWUKa50ZrW-tEaEvCVxz3cStz4ehD-c5iQH2c7l4st_VYHALktBlmOufKoSbCo-Zbfm4FRmaqgtdDAO9B8YGo', inStock: true },
    { id: 'sv-carrots', name: 'Organic Carrots', price: 3.00, unit: 'Bunch', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNc_gzo95ePuLVXTp4vbstY9UKtgttf3eHEzOuZ_3Wmipf61dyxEc3bSD27XlnexHkWyvTraI9Rh44A64CejNkEE9JpxuBoGOw2FCyrXC85psiG-HAQp1jFqDRrO7gd3T90nVTwEN7-Aw51dYVUxxeEYmdpLCb2j8QIG_c0V0lk3746KnDiPUD-e6pdeh2WSwt3jTKSv9sU8OCeZoGoVvF7M5wBZl8nz_v5B0E0OuiIzXx6Nt6y09rKqvTTlndflW6TWxR6CJRyO_x', inStock: true },
    { id: 'sv-greens', name: 'Spring Mix Greens', price: 5.00, unit: '8 oz bag', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX9azHphcY7uhGyxmg_AOe6xpTN0uMO9nTflDPzPM7vnHktJIVeiDFkhJtsFAq5sZYf6xRCn2Tw683GOLyqp5oqrv6qMgPJjONEQlszwyi2kfM0XLRyh8AK-AH4GtC4Yx809A8agSpHUMPPyZ1FOOT5dbq8stulbiHraBNlBOIRBhZmtpNHfh_QUZGgzUAvBkmrCDRYd-WvY630gaXT9owkeNnBTtDr0jq_o7abDQCp9nldYi5p87bgZOAeUk6rNfTthHavtuMfQXe', inStock: true },
    { id: 'sv-eggs', name: 'Pasture-Raised Eggs', price: 6.50, unit: 'Dozen', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWtHQxmngLJBC3W-wdCS2Wr3IXY2zsck76FKDHwYD0cTNEwxsgoJWpnerypv28jjFS_OFODUk9VVtVh8rxT5MYsJtdt7Wf-qgqE2VcaSbj4-jxD5BxR7WAw-yhYPHoFjSMQC0KcjixSFKbEWrNgOfWQFQbBOZrZAuQAdwfeYTa1v1ht68Ic6CFCO6J4d1v_W8YSDDrtB3XYdRtXU_ibmfGam5aYPReAiZK7RqkjcOa0yT9n4K3bySCSYkJLBx75WAuxR8nxjxwR-xi', inStock: true },
  ],
  'oak-heritage': [
    { id: 'oh-apples', name: 'Heritage Apples', price: 5.00, unit: 'Per lb', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQGfnOu7t6__-7ti95kzrtd__JJtgFuCTZJS0G7H1P9SIjGox1wqG-E_nQtePcO8JHQ8qG-wbz3yozpqfOTOiTeYz9yzbeLd0NBvpBg3UcmObnBKZwsg6qEHF0nA4HqEhL0VKsaV9YkDXVBRfVeorQ8wDNyQmHnq1KADdsiUx_mgAhSQCMR90J2VKS5Jke-GUsjKzhTKHpzk_gHuNcJAhfUEo86FWqqC5G6pRAZhO3x8M7BPhnRDSq-CA669NssZPeAltRrMHps8G', inStock: true },
    { id: 'oh-peaches', name: 'Organic Peaches', price: 6.00, unit: 'Per lb', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQGfnOu7t6__-7ti95kzrtd__JJtgFuCTZJS0G7H1P9SIjGox1wqG-E_nQtePcO8JHQ8qG-wbz3yozpqfOTOiTeYz9yzbeLd0NBvpBg3UcmObnBKZwsg6qEHF0nA4HqEhL0VKsaV9YkDXVBRfVeorQ8wDNyQmHnq1KADdsiUx_mgAhSQCMR90J2VKS5Jke-GUsjKzhTKHpzk_gHuNcJAhfUEo86FWqqC5G6pRAZhO3x8M7BPhnRDSq-CA669NssZPeAltRrMHps8G', inStock: true },
  ],
  'deep-roots': [
    { id: 'dr-beets', name: 'Red Beets', price: 3.50, unit: 'Bunch', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsxIQlHJlUzp5iSN0UzFjHRwM_QSYa3gmTiyHdnyW-e83dvwzPTyVzk9LMwsHOuoLesebhLWqDSN2W4Op47rpgdoiGtWs_mpC9_vN6tISxSdnkL6aMNgS-fsJxGg8yxfBkzt92UUD24dwKYsVmhz0Vda7a8MQJXNvsc54KlGxpjXVG45NtTFOd_lebunhJoNaVo4LGfycl9zARVMkiBHLDPKDBBEdNurgPi5O8z_U7GFfF6AqxMv4N-DDsVleqYybzBeabwPGvrRQF', inStock: true },
    { id: 'dr-basil', name: 'Fresh Basil', price: 2.50, unit: 'Bunch', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsxIQlHJlUzp5iSN0UzFjHRwM_QSYa3gmTiyHdnyW-e83dvwzPTyVzk9LMwsHOuoLesebhLWqDSN2W4Op47rpgdoiGtWs_mpC9_vN6tISxSdnkL6aMNgS-fsJxGg8yxfBkzt92UUD24dwKYsVmhz0Vda7a8MQJXNvsc54KlGxpjXVG45NtTFOd_lebunhJoNaVo4LGfycl9zARVMkiBHLDPKDBBEdNurgPi5O8z_U7GFfF6AqxMv4N-DDsVleqYybzBeabwPGvrRQF', inStock: true },
  ],
};

export function getMockFarmerById(id) {
  return mockFarmers.find((f) => f.id === id) || null;
}

export function getMockProductsByFarmer(farmerId) {
  return mockProducts[farmerId] || [];
}
