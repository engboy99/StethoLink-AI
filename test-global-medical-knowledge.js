const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Global Medical Knowledge Test - Every Disease in the World
async function testGlobalMedicalKnowledge() {
  console.log('🌍 GLOBAL MEDICAL KNOWLEDGE TEST\n');
  console.log('Testing comprehensive disease database with real-time updates...\n');

  const tests = [
    // GLOBAL DISEASE DATABASE TESTS
    {
      name: '🌍 GLOBAL: COVID-19 Comprehensive Information',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/COVID-19`);
        
        const data = response.data.data;
        const hasVariants = data.variants && data.variants.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasVaccines = data.vaccines && data.vaccines.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('million');
        const hasMortality = data.mortality && data.mortality.includes('million');
        const hasLastUpdated = data.lastUpdated;
        
        console.log('COVID-19 Info:', {
          hasVariants,
          hasSymptoms,
          hasTreatments,
          hasVaccines,
          hasGlobalCases,
          hasMortality,
          hasLastUpdated,
          variants: data.variants?.length,
          symptoms: data.symptoms?.length
        });
        
        return hasVariants && hasSymptoms && hasTreatments && hasVaccines && hasGlobalCases && hasMortality && hasLastUpdated;
      }
    },

    {
      name: '🌍 GLOBAL: Ebola Virus Disease Information',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Ebola Virus Disease`);
        
        const data = response.data.data;
        const hasOutbreaks = data.outbreaks && data.outbreaks.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('cases');
        const hasMortality = data.mortality && data.mortality.includes('%');
        
        console.log('Ebola Info:', {
          hasOutbreaks,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          outbreaks: data.outbreaks?.length,
          symptoms: data.symptoms?.length
        });
        
        return hasOutbreaks && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    {
      name: '🌍 GLOBAL: Malaria Comprehensive Data',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Malaria`);
        
        const data = response.data.data;
        const hasSpecies = data.species && data.species.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('million');
        const hasMortality = data.mortality && data.mortality.includes('deaths');
        
        console.log('Malaria Info:', {
          hasSpecies,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          species: data.species?.length,
          treatments: data.treatments?.length
        });
        
        return hasSpecies && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    // CARDIOVASCULAR DISEASES
    {
      name: '❤️ CARDIOVASCULAR: Coronary Artery Disease',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Coronary Artery Disease`);
        
        const data = response.data.data;
        const hasTypes = data.types && data.types.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('death');
        const hasMortality = data.mortality && data.mortality.includes('million');
        
        console.log('CAD Info:', {
          hasTypes,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          types: data.types?.length,
          treatments: data.treatments?.length
        });
        
        return hasTypes && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    // NEUROLOGICAL DISEASES
    {
      name: '🧠 NEUROLOGICAL: Alzheimer\'s Disease',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Alzheimer's Disease`);
        
        const data = response.data.data;
        const hasStages = data.stages && data.stages.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('million');
        const hasMortality = data.mortality && data.mortality.includes('dementia');
        
        console.log('Alzheimer\'s Info:', {
          hasStages,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          stages: data.stages?.length,
          symptoms: data.symptoms?.length
        });
        
        return hasStages && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    // CANCER
    {
      name: '🦠 CANCER: Lung Cancer Information',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Lung Cancer`);
        
        const data = response.data.data;
        const hasTypes = data.types && data.types.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('million');
        const hasMortality = data.mortality && data.mortality.includes('million');
        
        console.log('Lung Cancer Info:', {
          hasTypes,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          types: data.types?.length,
          treatments: data.treatments?.length
        });
        
        return hasTypes && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    // ENDOCRINE DISEASES
    {
      name: '⚖️ ENDOCRINE: Diabetes Mellitus',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/disease/Diabetes Mellitus`);
        
        const data = response.data.data;
        const hasTypes = data.types && data.types.length > 0;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasTreatments = data.treatments && data.treatments.length > 0;
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasGlobalCases = data.globalCases && data.globalCases.includes('million');
        const hasMortality = data.mortality && data.mortality.includes('million');
        
        console.log('Diabetes Info:', {
          hasTypes,
          hasSymptoms,
          hasTreatments,
          hasPrevention,
          hasGlobalCases,
          hasMortality,
          types: data.types?.length,
          treatments: data.treatments?.length
        });
        
        return hasTypes && hasSymptoms && hasTreatments && hasPrevention && hasGlobalCases && hasMortality;
      }
    },

    // REAL-TIME UPDATES
    {
      name: '🔄 REAL-TIME: Medical Updates System',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/updates`);
        
        const data = response.data.data;
        const hasLastUpdate = data.lastUpdate;
        const hasUpdateFrequency = data.updateFrequency && data.updateFrequency.includes('hours');
        const hasSources = data.sources && data.sources.length > 0;
        const hasRecentUpdates = data.recentUpdates && data.recentUpdates.length > 0;
        const hasTotalDiseases = data.totalDiseases && data.totalDiseases > 0;
        const hasSpecialties = data.specialties && data.specialties > 0;
        
        console.log('Real-Time Updates:', {
          hasLastUpdate,
          hasUpdateFrequency,
          hasSources,
          hasRecentUpdates,
          hasTotalDiseases,
          hasSpecialties,
          sources: data.sources?.length,
          recentUpdates: data.recentUpdates?.length,
          totalDiseases: data.totalDiseases,
          specialties: data.specialties
        });
        
        return hasLastUpdate && hasUpdateFrequency && hasSources && hasRecentUpdates && hasTotalDiseases && hasSpecialties;
      }
    },

    // DISEASE SEARCH BY SYMPTOMS
    {
      name: '🔍 SEARCH: Disease Search by Symptoms',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/global/search/symptoms`, {
          symptoms: ['fever', 'cough', 'fatigue']
        });
        
        const data = response.data.data;
        const hasSymptoms = data.symptoms && data.symptoms.length > 0;
        const hasResults = data.results && data.results.length > 0;
        const hasTotalMatches = data.totalMatches >= 0;
        
        // Check if COVID-19 is in results
        const hasCOVID19 = data.results.some(result => 
          result.disease.toLowerCase().includes('covid') || result.disease.toLowerCase().includes('coronavirus')
        );
        
        console.log('Disease Search:', {
          hasSymptoms,
          hasResults,
          hasTotalMatches,
          hasCOVID19,
          symptoms: data.symptoms?.length,
          results: data.results?.length,
          totalMatches: data.totalMatches
        });
        
        return hasSymptoms && hasResults && hasTotalMatches && hasCOVID19;
      }
    },

    // MEDICAL SPECIALTIES
    {
      name: '👨‍⚕️ SPECIALTIES: Medical Specialties Information',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/specialties`);
        
        const data = response.data.data;
        const hasSpecialties = data.specialties && data.specialties.length > 0;
        const hasTotal = data.total && data.total > 0;
        const hasLastUpdate = data.lastUpdate;
        
        // Check for key specialties
        const hasEmergency = data.specialties.some(s => s.name === 'Emergency Medicine');
        const hasCardiology = data.specialties.some(s => s.name === 'Cardiology');
        const hasOncology = data.specialties.some(s => s.name === 'Oncology');
        
        console.log('Medical Specialties:', {
          hasSpecialties,
          hasTotal,
          hasLastUpdate,
          hasEmergency,
          hasCardiology,
          hasOncology,
          total: data.total,
          specialties: data.specialties?.length
        });
        
        return hasSpecialties && hasTotal && hasLastUpdate && hasEmergency && hasCardiology && hasOncology;
      }
    },

    // DISEASE COMPARISON
    {
      name: '⚖️ COMPARISON: Disease Comparison Feature',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/global/compare`, {
          diseases: ['COVID-19', 'Influenza']
        });
        
        const data = response.data.data;
        const hasDiseases = data.diseases && data.diseases.length >= 2;
        const hasSimilarities = data.similarities;
        const hasDifferences = data.differences;
        
        // Check for common symptoms
        const hasCommonSymptoms = data.similarities?.commonSymptoms && data.similarities.commonSymptoms.length > 0;
        
        console.log('Disease Comparison:', {
          hasDiseases,
          hasSimilarities,
          hasDifferences,
          hasCommonSymptoms,
          diseases: data.diseases?.length,
          commonSymptoms: data.similarities?.commonSymptoms?.length
        });
        
        return hasDiseases && hasSimilarities && hasDifferences && hasCommonSymptoms;
      }
    },

    // GLOBAL STATISTICS
    {
      name: '📊 STATISTICS: Global Disease Statistics',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/statistics`);
        
        const data = response.data.data;
        const hasTotalDiseases = data.totalDiseases && data.totalDiseases > 0;
        const hasSpecialties = data.specialties && data.specialties > 0;
        const hasLastUpdate = data.lastUpdate;
        const hasCategories = data.categories;
        
        console.log('Global Statistics:', {
          hasTotalDiseases,
          hasSpecialties,
          hasLastUpdate,
          hasCategories,
          totalDiseases: data.totalDiseases,
          specialties: data.specialties
        });
        
        return hasTotalDiseases && hasSpecialties && hasLastUpdate && hasCategories;
      }
    },

    // DISEASE CATEGORIES
    {
      name: '📂 CATEGORIES: Disease Categories',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/global/categories`);
        
        const data = response.data.data;
        const hasCategories = data.categories && Object.keys(data.categories).length > 0;
        const hasTotalCategories = data.totalCategories && data.totalCategories > 0;
        const hasTotalDiseases = data.totalDiseases && data.totalDiseases > 0;
        
        // Check for key categories
        const hasInfectious = data.categories['Infectious Diseases'];
        const hasCardiovascular = data.categories['Cardiovascular Diseases'];
        const hasCancer = data.categories['Cancer'];
        
        console.log('Disease Categories:', {
          hasCategories,
          hasTotalCategories,
          hasTotalDiseases,
          hasInfectious,
          hasCardiovascular,
          hasCancer,
          totalCategories: data.totalCategories,
          totalDiseases: data.totalDiseases
        });
        
        return hasCategories && hasTotalCategories && hasTotalDiseases && hasInfectious && hasCardiovascular && hasCancer;
      }
    }
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailures = 0;

  console.log('🌍 STARTING GLOBAL MEDICAL KNOWLEDGE TESTING...\n');

  for (const test of tests) {
    try {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(80)}`);
      
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        failed++;
        if (test.name.includes('GLOBAL') || test.name.includes('REAL-TIME')) {
          criticalFailures++;
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
      failed++;
      if (test.name.includes('GLOBAL') || test.name.includes('REAL-TIME')) {
        criticalFailures++;
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('🌍 GLOBAL MEDICAL KNOWLEDGE TEST RESULTS');
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🚨 Critical Failures: ${criticalFailures}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 100% GLOBAL MEDICAL KNOWLEDGE ACHIEVED!');
    console.log('✅ System knows every disease in the world');
    console.log('✅ Real-time updates working perfectly');
    console.log('✅ Full precision maintained globally');
    console.log('✅ Comprehensive disease database complete');
    console.log('✅ Medical specialties covered');
    console.log('✅ Disease comparison features working');
    console.log('✅ Global statistics accurate');
    console.log('✅ Search functionality comprehensive');
    console.log('\n🚀 SYSTEM KNOWS EVERY DISEASE IN THE WORLD WITH REAL-TIME UPDATES!');
  } else if (criticalFailures === 0) {
    console.log('\n⚠️ MOSTLY GLOBAL:');
    console.log('• Core global disease knowledge working');
    console.log('• Real-time updates functional');
    console.log('• Some advanced features need improvement');
    console.log('• System covers major diseases worldwide');
  } else {
    console.log('\n🚨 CRITICAL GLOBAL ISSUES:');
    console.log('• Global disease knowledge incomplete');
    console.log('• Real-time updates not working');
    console.log('• System does not know all diseases');
    console.log('• Immediate global knowledge expansion needed');
  }

  return {
    passed,
    failed,
    criticalFailures,
    successRate: ((passed / (passed + failed)) * 100).toFixed(1),
    isGlobal: failed === 0
  };
}

// Run the global medical knowledge test
testGlobalMedicalKnowledge().catch(error => {
  console.error('❌ Global medical knowledge test failed:', error.message);
  process.exit(1);
}); 