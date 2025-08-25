/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { TreemapChart, SunburstChart, SankeyChart, ScatterChart } from 'echarts/charts';
import { GeoComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import worldJson from '../../../../assets/maps/usa.geo.json';
import { UserClinicSite } from '../../../models/user-clinic-site.model';
import { Clinic } from '../../../models/clinic.model';
import { Site } from '../../../models/site.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { GraphChart } from 'echarts/charts';
import { ReportsUiService } from '../reports-ui.service';
import { forkJoin } from 'rxjs';
import { MaterialModule } from "../../../core/shared/material.module";

// Register charts/components
echarts.use([TreemapChart, GraphChart, SunburstChart, SankeyChart, ScatterChart, GeoComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

// Register world map
echarts.registerMap('world', worldJson as any);

@Component({
  selector: 'app-clinic-site-analytics-dashboard',
  templateUrl: './clinic-site-analytics-dashboard.component.html',
  styleUrls: ['./clinic-site-analytics-dashboard.component.scss'],
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, NgxChartsModule, NgxEchartsModule]
})
export class ClinicSiteAnalyticsDashboardComponent implements OnInit {
  clinics: Clinic[] = [];
  sites: Site[] = [];
  userClinicSites: UserClinicSite[] = [];

  filteredSites: Site[] = [];

  selectedClinicId: string | null = null;
  selectedSiteId: string | null = null;

  startDate: string | null = null;
  endDate: string | null = null;

  treemapOptions!: EChartsOption;
  sunburstOptions!: EChartsOption;
  sankeyOptions!: EChartsOption;
  mapOptions!: EChartsOption;
  graphOptions!: EChartsOption;

  constructor(private reportsUiService: ReportsUiService) {}

  ngOnInit() {
    // Load all data in parallel
    forkJoin({
      clinics: this.reportsUiService.getClinics(),
      sites: this.reportsUiService.getSites(),
      userClinicSites: this.reportsUiService.getUserClinicSites()
    }).subscribe(({ clinics, sites, userClinicSites }) => {
      this.clinics = clinics;
      this.sites = sites;
      this.userClinicSites = userClinicSites;

      this.filteredSites = this.sites;
      this.updateCharts();
    });
  }

  onClinicChange() {
    this.filteredSites = this.selectedClinicId
      ? this.sites.filter(s => s.clinic_id === this.selectedClinicId)
      : this.sites;

    this.selectedSiteId = null;
    this.updateCharts();
  }

  onSiteChange() {
    this.updateCharts();
  }

  onDateChange() {
    this.updateCharts();
  }

  private getFilteredData() {
    return this.userClinicSites.filter(u =>
      (!this.selectedClinicId || u.clinicId === this.selectedClinicId) &&
      (!this.selectedSiteId || u.siteId === this.selectedSiteId) &&
      (!this.startDate || new Date(u.created_at as string | Date) >= new Date(this.startDate)) &&
      (!this.endDate || new Date(u.created_at as string | Date) <= new Date(this.endDate))
    );
  }

  private updateCharts() {
    const filteredData = this.getFilteredData();

    // Treemap
    this.treemapOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (info: any) => {
          const value = info.value || 0;
          return `<b>${info.name}</b><br/>Users: ${value}`;
        }
      },
      series: [
        {
          type: 'treemap',
          data: this.clinics.map(c => ({
            name: c.name,
            children: this.sites
              .filter(s => s.clinic_id === c.id)
              .map(s => ({
                name: s.name,
                value: filteredData.filter(u => u.siteId === s.id).length
              }))
          }))
        }
      ]
    };

    // Sunburst
    this.sunburstOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (info: any) => {
          const value = info.value || 0;
          return `<b>${info.name}</b><br/>Users: ${value}`;
        }
      },
      series: {
        type: 'sunburst',
        data: this.clinics.map(c => ({
          name: c.name,
          children: this.sites
            .filter(s => s.clinic_id === c.id)
            .map(s => ({
              name: s.name,
              value: filteredData.filter(u => u.siteId === s.id).length
            }))
        })),
        radius: [0, '90%']
      }
    };


    // Map
    this.mapOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const [lon, lat, count] = params.value;
            const site = this.sites.find(s => s.name === params.name);
            if (site) {
              return `<b>${site.name}</b><br/>${site.address}<br/>${site.city}, ${site.state}`;
            }
            return `<b>${params.name}</b><br/>Users: ${count}`;
        }
      },
      geo: {
        map: 'world',
        roam: true,
        emphasis: { label: { show: false } }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this.sites
            .filter(s => !this.selectedClinicId || s.clinic_id === this.selectedClinicId)
            .filter(s => !this.selectedSiteId || s.id === this.selectedSiteId)
            .map(s => ({
              name: s.name,
              value: [s.lon, s.lat, filteredData.filter(u => u.siteId === s.id).length]
            }))
        }
      ]
    };
  }
}
