import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

import { VideoPreview } from './video-preview';

describe('VideoPreview', () => {
  let fixture: ComponentFixture<VideoPreview>;
  let component: VideoPreview;
  let getUserMediaSpy: jasmine.Spy;
  let stopTrackSpy: jasmine.Spy;

  function createRealMockStream(): MediaStream {
    const stream = new MediaStream();

    stopTrackSpy = jasmine.createSpy('stop');

    spyOn(stream, 'getTracks').and.returnValue([
      {
        stop: stopTrackSpy,
      } as unknown as MediaStreamTrack,
    ]);

    return stream;
  }

  function mockGetUserMediaSuccess(stream: MediaStream): void {
    getUserMediaSpy = jasmine.createSpy('getUserMedia').and.resolveTo(stream);

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: getUserMediaSpy,
      },
      configurable: true,
    });
  }

  function mockGetUserMediaError(): void {
    getUserMediaSpy = jasmine.createSpy('getUserMedia').and.rejectWith(new Error('Camera error'));

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: getUserMediaSpy,
      },
      configurable: true,
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPreview],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', fakeAsync(() => {
    mockGetUserMediaSuccess(createRealMockStream());

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();

    expect(component).toBeTruthy();
  }));

  it('should request camera access when component is initialized', fakeAsync(() => {
    const stream = createRealMockStream();
    mockGetUserMediaSuccess(stream);

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();

    expect(getUserMediaSpy).toHaveBeenCalledWith({
      video: true,
      audio: false,
    });
  }));

  it('should render video element when there is no error', fakeAsync(() => {
    mockGetUserMediaSuccess(createRealMockStream());

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video') as HTMLVideoElement;

    expect(video).toBeTruthy();
    expect(video.hasAttribute('autoplay')).toBeTrue();
    expect(video.hasAttribute('muted')).toBeTrue();
    expect(video.hasAttribute('playsinline')).toBeTrue();
  }));

  it('should attach media stream to video element', fakeAsync(() => {
    const stream = createRealMockStream();
    mockGetUserMediaSuccess(stream);

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video') as HTMLVideoElement;

    expect(video).toBeTruthy();
    expect(video.srcObject).toBe(stream);
  }));

  it('should show countdown after camera stream starts', fakeAsync(() => {
    mockGetUserMediaSuccess(createRealMockStream());

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Snapshot in 5');
  }));

  it('should update countdown over time', fakeAsync(() => {
    mockGetUserMediaSuccess(createRealMockStream());

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();

    tick(1000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Snapshot in 4');
  }));

  it('should show error message when camera access fails', fakeAsync(() => {
    mockGetUserMediaError();

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(
      'Camera access was denied or the camera is not available.',
    );
  }));

  it('should emit snapshot and stop camera after 5 seconds', fakeAsync(() => {
    const stream = createRealMockStream();
    mockGetUserMediaSuccess(stream);

    fixture = TestBed.createComponent(VideoPreview);
    component = fixture.componentInstance;

    spyOn(component.snapshotCaptured, 'emit');

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    const video = fixture.nativeElement.querySelector('video') as HTMLVideoElement;

    expect(video).toBeTruthy();

    Object.defineProperty(video, 'videoWidth', {
      value: 640,
      configurable: true,
    });

    Object.defineProperty(video, 'videoHeight', {
      value: 480,
      configurable: true,
    });

    tick(5000);

    expect(component.snapshotCaptured.emit).toHaveBeenCalled();
    expect(stopTrackSpy).toHaveBeenCalled();
  }));
});
