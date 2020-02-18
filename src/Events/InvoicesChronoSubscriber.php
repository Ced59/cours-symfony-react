<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

/**
 * Class InvoicesChronoSubscriber
 * @package App\Events
 */
class InvoicesChronoSubscriber implements EventSubscriberInterface {
    private $security;
    private $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * Returns an array of event names this subscriber wants to listen to.
     *
     * The array keys are event names and the value can be:
     *
     *  * The method name to call (priority defaults to 0)
     *  * An array composed of the method name to call and the priority
     *  * An array of arrays composed of the method names to call and respective
     *    priorities, or 0 if unset
     *
     * For instance:
     *
     *  * ['eventName' => 'methodName']
     *  * ['eventName' => ['methodName', $priority]]
     *  * ['eventName' => [['methodName1', $priority], ['methodName2']]]
     *
     * @return array The event names to listen to
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoices', EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * @param ViewEvent $event
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function setChronoForInvoices(ViewEvent $event): void
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST") {
            $nextChrono = $this->invoiceRepository->findNextChrono($this->security->getUser());
            $invoice->setChrono((int)$nextChrono);

            dd($invoice);
        }
    }
}