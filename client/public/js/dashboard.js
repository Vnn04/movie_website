//Sidebar toggle



var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if(!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive")
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if(sidebarOpen) {
        sidebar.classList.remove("sidebar-responsive")
        sidebarOpen = false;
    }
}

let action = document.currentScript.getAttribute('actionCount');
let adventure = document.currentScript.getAttribute('adventureCount');
let animation = document.currentScript.getAttribute('animationCount');
let comedy = document.currentScript.getAttribute('comedyCount');
let crime = document.currentScript.getAttribute('crimeCount');

//------- CHARTS -------

//BAR CHART
var barChartOptions = {
  series: [{
    data: [action, adventure, comedy, animation, crime],
    name: "Movies",
  }],
  chart: {
    type: 'bar',
    background: "transparent",
    height: 350,
    toolbar: {
        show: false,
    },
  },
  colors: [
    "#2962ff",
    "#d50000",
    "#2e7d32",
    "#ff6d00",
    "#583cb3"
  ],
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: "40%"
    }
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    opacity: 1,
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
        lines: {
            show: true,
        },
    },
    xaxis: {
        lines: {
            show: true,
        },
    },
  },
  legend: {
    labels: {
        color: "#f5f7ff",
    },
    show: true,
    position: "top",
  },
  stroke: {
    colors: ["transparent"],
    show: true,
    width: 2
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: "dark",
  },
  xaxis: {
    categories: ['Action', 'Adventure', 'Comedy', 'Animation', 'Crime'],
    title: {
        style: {
            color: "#f5f7ff",
        },
    },
    axisBorder: {
        show: true, 
        color: "#f5f7ff",
    },
    axisTicks: {
        show: true,
        color: "#f5f7ff",
    },
    labels: {
        style: {
            colors: "#f5f7ff",
        },
    },
  },
  yaxis: {
    title: {
        text: "Count",
        style: {
            color: "#f5f7ff",
        },
    },
    axisBorder: {
        color: "#f5f7ff",
        show: true,
    },
    axisTicks: {
        color: "#f5f7ff",
        show: true,
    }, 
    label: {
        style: {
            colors: "#f5f7ff",
        },
    },
  },
  };

  var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
  barChart.render();

  // AREA CHART
const areaChartOptions = {
    series: [
      {
        name: 'Purchase Orders',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'Sales Orders',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      type: 'area',
      background: 'transparent',
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#00ab57', '#d50000'],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical',
      },
      type: 'gradient',
    },
    grid: {
      borderColor: '#55596e',
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      labels: {
        colors: '#f5f7ff',
      },
      show: true,
      position: 'top',
    },
    markers: {
      size: 6,
      strokeColors: '#1b2635',
      strokeWidth: 3,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      axisBorder: {
        color: '#55596e',
        show: true,
      },
      axisTicks: {
        color: '#55596e',
        show: true,
      },
      labels: {
        offsetY: 5,
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Purchase Orders',
          style: {
            color: '#f5f7ff',
          },
        },
        labels: {
          style: {
            colors: ['#f5f7ff'],
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Sales Orders',
          style: {
            color: '#f5f7ff',
          },
        },
        labels: {
          style: {
            colors: ['#f5f7ff'],
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    },
  };
  
  const areaChart = new ApexCharts(
    document.querySelector('#area-chart'),
    areaChartOptions
  );
  areaChart.render();


