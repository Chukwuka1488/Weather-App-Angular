import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICurrentWeather } from '../interfaces';
import { map } from 'rxjs/operators';

// const city = "Lagos"
// const api = `${environment.baseUrl}`
// console.log(`The api is : ${api}?q=${city}&appid=${environment.appId}`)
interface ICurrentWeatherData {
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
  };
  dt: number;
  sys: {
    country: string;
  };
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}

  getCurrentWeather(city: string): Observable<ICurrentWeather> {
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}?q=${city}&appid=${environment.appID}`
      )
      .pipe(map((data) => this.transformToICurrentWeather(data)));
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToCelcius(data.main.temp),
      description: data.weather[0].description,
    };
  }

  private convertKelvinToCelcius(kelvin: number): number {
    return kelvin - 273.15;
  }
}
